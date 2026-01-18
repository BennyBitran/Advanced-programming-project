const crypto = require("crypto");
const { sendRequest } = require("../services/backendSocketComms");
const { listFilePermissions: listFilePermissions,
  listUserPermissions: listUserPermissions,
  checkUserPermission: checkUserPermission
  getPermissionByUserAndFile } = require("./permissions");

const files = [];

function getFileMetadata(id) {
  return files.find(f => f.id === id);
}

// List files for a user under a specific parent folder (or root if parentId is null)
function listFiles(userId, parentId = null) {
  let hasAccess;
  if (parentId) {
    hasAccess = checkUserPermission(parentId, userId, 'read');
  }
  if (parentId && !hasAccess) {
    throw { status: 403, message: "Access denied to the specified folder" };
  }

  // list all file ids the user has permissions for
  const userPerms = listUserPermissions(userId).map(p => p.fileId);

  // return all files in specified parent (null = root) that user is the owner or has permissions for
  return files.filter(file =>
    file.parentId === parentId &&
    (file.ownerId === userId || userPerms.includes(file.id))
  );
}


// Creates metadata in Node.js and physical content in C++
async function createFile({ name, ownerId, type, parentId, content }) {
  // check parent existence and type
  if (parentId) {
    const parent = getFileMetadata(parentId);
    if (!parent) {
      throw { status: 404, message: "Parent directory not found" };
    }
    if (parent.type !== "folder") {
      throw { status: 400, message: "Cannot create items inside a file" };
    }

    //check writing permissions to parent folder
    const hasWriteAccess = checkUserPermission(parentId, ownerId, 'write');
    if (!hasWriteAccess) {
      throw { status: 403, message: "Permission denied: Cannot write to this folder" };
    }
  }

  let id;
  do {
    id = crypto.randomUUID();
  } while (files.some((file) => file.id === id));

  const normalizedType = type === "folder" ? "folder" : "file";

  const newFile = {
    id,
    name,
    ownerId,
    type: normalizedType,
    parentId: parentId ?? null,
    isTrashed: false,
    creationTime: new Date().toISOString(),
    lastUpdateTime: new Date().toISOString()
  };

  try {
    if (normalizedType === "file" && content?.trim()) {
      const result = await sendRequest(`POST ${id} ${content}`);
      if (result?.status && result.status >= 400) {
        throw result;
      }
    }

    files.push(newFile);
    return newFile;

  } catch (err) {
    throw {
      status: err?.status ?? 500,
      message: err?.message ?? "Failed to create file in backend"
    };
  }
}



async function getFile(id, userId) {
  const fileMetadata = files.find(f => f.id === id);
  if (!fileMetadata) {
    throw { status: 404, message: "File not found" };
  }

  const hasAccess = checkUserPermission(id, userId, 'read');
  if (!hasAccess) {
    throw { status: 403, message: "Access denied" };
  }

  // Fetch file names if it's a folder
  if (fileMetadata.type === "folder") {
    const children = files.filter(f => f.parentId === id).map(child => ({
      id: child.id,
      name: child.name,
      ownerId: child.ownerId,
      type: child.type,
      parentId: child.parentId
    }));
    // Return folder metadata with children
    return {
      id: fileMetadata.id,
      name: fileMetadata.name,
      ownerId: fileMetadata.ownerId,
      type: fileMetadata.type,
      children
    };
  }

  let fileContent = "";

  try {
    // Fetch content from backend for files
    const response = await sendRequest(`GET ${id}`);
    fileContent = response?.content ?? "";
  } catch (err) {
    // catch 404 from backend as empty content (for empty files we save only metadata)
    if (err?.status === 404) {
      fileContent = "";
    } else {
      throw {
        status: err?.status ?? 500,
        message: err?.message ?? "Failed to fetch content from backend"
      };
    }
  }

  return {
    id: fileMetadata.id,
    name: fileMetadata.name,
    ownerId: fileMetadata.ownerId,
    type: fileMetadata.type,
    parentId: fileMetadata.parentId,
    creationTime: fileMetadata.creationTime,
    lastUpdateTime: fileMetadata.lastUpdateTime,
    content: fileContent ?? ""
  };
}




// Search files by logical name or content
async function searchFiles(query, userId) {
  try {
    if (query === undefined || query === null || query.trim() === "") {
      return [];
    }
    const lowerQuery = (query || "").toLowerCase();

    // List files user has access to
    const allowedFiles = files.filter(f => {
      return checkUserPermission(f.id, userId, 'read');
    });

    // Request backend search and split results to array of physical IDs
    const cppResponse = await sendRequest(`SEARCH ${query}`);
    const physicalIds = cppResponse.status === 200
      ? (cppResponse.content || "").trim().split(/\s+/).filter(Boolean)
      : [];

    const finalResults = [];

    // Use a loop to allow await inside
    for (const file of allowedFiles) {
      // Check logical name match
      if (file.name.toLowerCase().includes(lowerQuery)) {
        finalResults.push(file);
        continue;
      }

      // Check if C++ found this specific file ID
      const inCppResults = physicalIds.includes(file.id);

      if (inCppResults) {
        // If the ID includes the query, we MUST verify content
        if (file.id.toLowerCase().includes(lowerQuery)) {
          const requestFile = await sendRequest(`GET ${file.id}`);
          const fileContent = requestFile.content || "";

          if (requestFile.status === 200 && fileContent.toLowerCase().includes(lowerQuery)) {
            finalResults.push(file);
          }
        }
        // If ID doesn't include query but C++ found it then content must match
        else {
          finalResults.push(file);
        }
      }
    }

    return finalResults;
  } catch (err) {
    throw {
      status: err?.status ?? 500,
      message: err?.message ?? "Search failed"
    };
  }
}


async function deleteFile(fileId, userId) {
  const file = files.find(f => f.id === fileId);
  if (!file) throw { status: 404, message: "File not found" };
  //check if user is the file's owner
  if (file.ownerId === userId) {
    if (!file.isTrashed) {
      //mark trash first
      file.isTrashed = true;
      return { status: 200, data: file };
    } else {
      //if file already trashed - delete it permanently.
      deleteSubtree(fileId);
      return { status: 204, data: "Permanently deleted" };
    }
  } else {
    //if the file is shared with the user - remove the permission
    let permId = getPermissionByUserAndFile(userId, fileId);
    if (permId) {
      removePermission(permId);
      return { status: 204, data: "Permission removed" };
    }
    //if the file is inside a shared folder that user has permission to write 
    // actually delete it (Google implementation)
    if (checkUserPermission(fileId, userId, "write")) {
      deleteSubtree(fileId);
      return { status: 204, data: "Permanently deleted" };
    }
  }
  return { status: 403, message: "Permission denied: Cannot delete file or folder"}
}

async function deleteSubtree(id) {
  //find children
  const children = files.filter(f => f.parentId === id);

  for (const child of children) {
    await deleteSubtree(child.id);
  }

  const node = files.find(f => f.id === id);
  if (node?.type === "file") {
    const result = await sendRequest(`DELETE ${id}`);
    if (result?.status >= 400 && result.status !== 404) throw result;
  }

  // remove metadata for this node
  const idx = files.findIndex(f => f.id === id);
  if (idx !== -1) files.splice(idx, 1);
}


/**
 * Updates file metadata and/or physical content.
 * If content is provided, it replaces the physical file in C++.
 */
async function updateFile(fileId, userId, { name, content }) {
  try {
    const file = files.find(f => f.id === fileId);
    if (!file) throw { status: 404, message: "File not found" };

    // check write permissions
    const hasAccess = checkUserPermission(fileId, userId, 'write');
    if (!hasAccess) throw { status: 403, message: "Write permission required" };

    // rename (logical name) - metadata only
    if (name !== undefined) {
      const newName = String(name).trim();
      if (!newName) throw { status: 400, message: "Non empty name is required" };
      file.name = newName;
    }

    // content update (files only) - delete+post on backend
    if (content !== undefined) {
      if (file.type !== "file") throw { status: 400, message: "Cannot patch content of a folder" };

      const newContent = String(content);

      // delete physical if exists; 404 is ok (empty file case)
      try {
        const del = await sendRequest(`DELETE ${fileId}`);
        if (del?.status && del.status >= 400 && del.status !== 404) throw del;
      } catch (err) {
        if (err?.status !== 404) throw err;
      }

      // create physical only if non-empty
      if (newContent.trim() !== "") {
        const post = await sendRequest(`POST ${fileId} ${newContent}`);
        if (post?.status && post.status >= 400) throw post;
      }
    }

    file.lastUpdateTime = new Date().toISOString();

    return { ...file };
  } catch (err) {
    throw {
      status: err?.status ?? 500,
      message: err?.message ?? "Failed to patch file"
    };
  }
}


module.exports = {
  listFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
  searchFiles,
  getFileMetadata,
};
