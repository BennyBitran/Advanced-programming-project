const crypto = require("crypto");
const { sendRequest } = require("../services/backendSocketComms");
const { listFilePermissions: listFilePermissions,
        listUserPermissions: listUserPermissions } = require("./permissions");

const files = [];

function getFileMetadata(id) {
  return files.find(f => f.id === id);
}

// List files for a user under a specific parent folder (or root if parentId is null)
function listFiles(userId, parentId = null) {
  // list just the file ids the user has permission to
  const userPerms = listUserPermissions(userId).map(p => p.fileId);

  return files.filter(file =>
    file.parentId === parentId &&
    (file.ownerId === userId || userPerms.includes(file.id))
  );
}

/**
 * Creates metadata in Node.js and physical content in C++.
 */
async function createFile({ name, ownerId, type, parentId, content }) {
  do {
  const id = crypto.randomUUID();
  } while (files.some((file) => file.id === id));

  const normalizedType = type === "folder" ? "folder" : "file";

  const newFile = {
    id,
    name,
    ownerId,
    type: normalizedType,
    parentId: parentId ?? null
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

    const permissions = listFilePermissions(id);
    const hasAccess = fileMetadata.ownerId === userId || permissions.some(p => p.userId === userId);

    if (!hasAccess) {
        throw { status: 403, message: "Access denied" };
    }

    try {
        let fileContent = null;
        if (fileMetadata.type === "file") {
            const response = await sendRequest(`GET ${id}`);
            fileContent = response.content;
        }
        return {
            id: fileMetadata.id,
            name: fileMetadata.name,
            ownerId: fileMetadata.ownerId,
            type: fileMetadata.type,
            content: fileContent ?? ""
        };
    } catch (err) {
        throw {
            status: err?.status ?? 500,
            message: err?.message ?? "Failed to fetch content from backend"
        };
    }
}



// Search files by logical name or content
async function searchFiles(query, userId) {
  try {
    if (query === undefined || query === null || query.trim() === "") {
      return [];
    }
    const lowerQuery = (query || "").toLowerCase();
    const userPerms = listUserPermissions(userId).map(p => p.fileId);

    // List files user has access to
    const allowedFiles = files.filter(f => {
      const isOwner = f.ownerId === userId;
      const hasPerm = f.ownerId === userId || userPerms.includes(f.id);
      return isOwner || hasPerm;
    });

    // Request backend search
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


async function deleteFile(id, userId) {
  const root = getFileMetadata(id);
  if (!root) throw { status: 404, message: "File not found" };
  //check if user can delete file/folder
  const canDelete = root.ownerId === userId ||
    listFilePermissions(id).some(p => p.userId === userId && p.permissionType === "write");

  if (!canDelete) throw { status: 403, message: "Write permission required" };

  // recursively delete subtree without checking permissions again
  await deleteSubtree(id);

  return true;
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

    // rename (logical name) - metadata only
    if (name !== undefined) {
      const newName = String(name).trim();
      if (!newName) throw { status: 400, message: "Name is required" };
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