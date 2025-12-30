const crypto = require("crypto");
// each file: {id, name, ownerId, type, parentId}
const files = [];

function listFiles(ownerId) {
  return files.filter((file) => file.ownerId === ownerId && file.parentId === null);
}

function createFile({name, ownerId, type, parentId}) {
  let id;
  const normalizedType = type === "folder" ? "folder" : "file";
  do {
    id = crypto.randomUUID();
  } while (files.some((file) => file.id === id));
  const newFile = {
    id,
    name,
    ownerId,
    type: normalizedType,
    parentId: parentId ?? null
  }

  files.push(newFile);
  return newFile;

}

function getFile(id) {
  return files.find((file) => file.id === id) || null;

}

function updateFile(id, newName) {
  const file = files.find((file) => file.id === id);
  if (!file) {
    return false;
  }
  file.name = newName;
  return true;
}

function deleteFile(id) {
  const index = files.findIndex((file) => file.id === id);
  if (index === -1) {
    return false;
  }
  files.splice(index, 1);
  return true;
}

function searchFiles(query) {
  const lowerQuery = (query || "").toLowerCase();
  if (lowerQuery === "") {
    return [];
  }
  return files.filter((file) =>
  (file.name || "").toLowerCase().includes(lowerQuery));

}

module.exports = {
  listFiles,
  createFile,
  getFile,
  updateFile,
  deleteFile,
  searchFiles,
}