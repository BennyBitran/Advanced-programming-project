const crypto = require("crypto");
const { sendRequest } = require("../services/backendSocketComms");
const { listPermissions: listPermissionsModel } = require("./permissions");

const files = [];

/**
 * Returns files owned by the user at the root level.
 */
function listFiles(ownerId) {
  return files.filter((file) => file.ownerId === ownerId && file.parentId === null);
}

/**
 * Creates metadata in Node.js and physical content in C++.
 */
async function createFile({ name, ownerId, type, parentId, content }) {
  const id = crypto.randomUUID();
  const normalizedType = type === "folder" ? "folder" : "file";

  const newFile = {
    id,
    name,
    ownerId,
    type: normalizedType,
    parentId: parentId ?? null
  };

  // Only call backend server if it's a file and has content
  if (normalizedType === "file" && content && content.trim() !== "") {
    // Send content to backend
    const response = await sendRequest(`POST ${id} ${content}`);
    if (response.status !== 201) {
      throw new Error(`Backend failed: ${response.statusText}`);
    }
  }

  files.push(newFile);
  return newFile;
}


async function getFileContent(id) {
  // request file content from backend
  const response = await sendRequest(`GET ${id}`);

  // Return content only on 200 Ok
  if (response.status === 200) {
    return response.content;
  }

  return null;
}


// Search files by logical name or content
async function searchFiles(query, userId) {
  if (query === undefined || query === null || query === "") {
    return [];
  }
  const lowerQuery = (query || "").toLowerCase();

  // List files user has access to
  const allowedFiles = files.filter(f => {
    const isOwner = f.ownerId === userId;
    const hasPerm = listPermissionsModel(f.id).some(p => p.userId === userId);
    return isOwner || hasPerm;
  });

  // Request backend search
  const cppResponse = await sendRequest(`SEARCH ${query}`);
  const physicalIds = cppResponse.status === 200 ? cppResponse.content.trim().split(/\s+/) : [];

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
      // If the ID itself matches the query, we MUST verify content
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
}

async function deleteFile(id) {
  // Find file index
  const index = files.findIndex((file) => file.id === id);
  if (index === -1) return false;

  const file = files[index];
  if (file.type === "file") {
    // delete and dont wait for response
    sendRequest(`DELETE ${id}`).catch(() => {}); 
  }
  // Remove metadata
  files.splice(index, 1);
  return true;
}

function getFile(id) {
  return files.find((file) => file.id === id) || null;
}

/**
 * Updates file metadata and/or physical content.
 * If content is provided, it replaces the physical file in C++.
 */
async function updateFile(id, newName, newContent) {
  const file = files.find((f) => f.id === id);
  if (!file) return false;

  // 1. Update Logical Name in Node.js memory if provided
  if (newName) {
    file.name = newName;
  }

  // 2. If content is provided, update physical storage in C++
  if (newContent !== undefined && file.type === "file") {
    // Delete the old physical file first
    await sendRequest(`DELETE ${id}`);

    // Create it again with the same ID but new content
    // Only send to C++ if the new content isn't empty
    if (newContent.trim() !== "") {
      const response = await sendRequest(`CREATE ${id} ${newContent}`);
      if (response.status !== 201 && response.status !== 200) {
        throw new Error("Failed to update physical content on backend");
      }
    }
  }

  return true;
}


module.exports = {
  listFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
  searchFiles,
};