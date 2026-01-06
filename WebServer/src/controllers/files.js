const { listFiles: listFilesModel,
        createFile: createFileModel,
        getFile: getFileModel,
        updateFile: updateFileModel,
        deleteFile: deleteFileModel,
        getFileMetadata: getFileMetadata } = require("../models/files"); 

const {getUserById} = require("../models/users");

// Helper function to validate that user sent correct X-User-Id header and that user exists in system
function validateUser(req, res) {
    const userId = req.get("X-User-Id");
    if (!userId || !getUserById(userId)) {
        res.status(401).json({ error: "Unauthorized" });
        return null;
    }
    return userId;
}


function listFiles(req, res) {
    // check for user id in header - in real app we would use authentication middleware with tokens
    const userId = validateUser(req, res);
    if (!userId) {
        return; // response already sent in validateUser
    }
    //force parentId to be null if not provided, and convert to string otherwise
    // fixed not to handle null === "null" → false
    const parentIdParam = req.query.parentId;
    const parentId = parentIdParam === undefined || parentIdParam === 'null' || parentIdParam === ''
    ? null : String(parentIdParam);

    // returns all files for the specified user only
    const rawFiles = listFilesModel(userId, parentId); 

    const files = rawFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        parentId: file.parentId,
        creationTime: file.creationTime,
        lastUpdateTime: file.lastUpdateTime
    }));
    return res.status(200).json(files);
}

async function createFile(req, res) {
  const userId = validateUser(req, res);
  if (!userId) return;
  
  const { name, type = "file", parentId, content } = req.body || {};

  if (!name || typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({ error: "Name is required" });
  }

  if (type !== "file" && type !== "folder") {
    return res.status(400).json({ error: "Type must be either 'file' or 'folder'" });
  }

  const pid = parentId === undefined || parentId === "null" || parentId === "" ? null : String(parentId);

    if (pid) {
        const parentFile = getFileMetadata(pid);
        if (!parentFile || parentFile.type !== "folder") {
            return res.status(400).json({ error: "Invalid parentId" });
        }
        // parent permission check moved to model
    }

  try {
    const newFile = await createFileModel({
      name: name.trim(),
      ownerId: userId,
      type,
      parentId: pid,
      content,
    });
    
    res.set("Location", `/api/files/${newFile.id}`);
    return res.status(201).send();
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || "Failed to create file" });
  }
}

async function getFile(req, res) {
    const userId = validateUser(req, res);
    const fileId = req.params.id;

    if (!fileId) {
        return res.status(400).json({ error: "File id is required" });
    }
    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        const data = await getFileModel(fileId, userId);
        res.status(200).json(data);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}
  

async function updateFile(req, res) {
    // check for user id in header - in real app we would use authentication middleware with tokens
    const userId = validateUser(req, res);
    if (!userId) {
        return; // response already sent in validateUser
    }
    // get file id from params and new name from body
    const fileId = req.params.id;
    if (!fileId) {
        return res.status(400).json({ error: "File id is required" });
    }
    //find file
    const file = getFileMetadata(fileId);
    if (!file) {
        return res.status(404).json({ error: "File not found" });
    }

    const { name , content } = req.body || {};

    try {
        await updateFileModel(fileId, userId, { name, content });
        return res.status(204).send();
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message || "Failed to update file" });
  }
}

async function deleteFile(req, res) {
  const userId = validateUser(req, res);
  if (!userId) return;

  const { id } = req.params;
  const file = getFileMetadata(id);
  if (!file) return res.status(404).json({ error: "File not found" });

  try {
    await deleteFileModel(id, userId);
    return res.status(204).send();
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message || "Failed to delete file" });
  }
}


module.exports = { listFiles, createFile, getFile, updateFile, deleteFile };
  
  
