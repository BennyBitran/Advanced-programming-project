const { listFiles: listFilesModel,
        createFile: createFileModel,
        getFile: getFileModel,
        updateFile: updateFileModel,
        deleteFile: deleteFileModel } = require("../models/files"); 


function listFiles(req, res) {
    // check for user id in header - in real app we would use authentication middleware with tokens
    const userId = req.get("X-User-Id");
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" }); // maybe we will change it later
    }

    const parentIdParam = req.query.parentId || null;
    const parentId = parentIdParam === undefined || parentIdParam === 'null' || parentIdParam === '' ? null : String(parentIdParam);

    // returns all files for the specified user only
    const rawFiles = listFilesModel(userId, parentId); 

    // return only id and name (can have more fields like size, date created, etc. we will see later)
    const files = rawFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        parentId: file.parentId
    }));
    return res.status(200).json(files);       
}

function createFile(req, res) {
    const userId = req.get("X-User-Id");
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, type = "file", parentId } = req.body || {};

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "Name is required" });
    }

    if (type !== "file" && type !== "folder") {
        return res.status(400).json({ error: "Type must be either 'file' or 'folder'" });
    }
    const pid = parentId === undefined || parentId === 'null' || parentId === '' ? null : String(parentId);
    if (pid) {
        const parentFile = getFileModel(pid);
        if (!parentFile || parentFile.ownerId !== userId || parentFile.type !== "folder") {
            return res.status(400).json({ error: "Invalid parentId" });
        }
    }
    const newFile = createFileModel({
        name: name.trim(),
        type,
        parentId: pid,
        ownerId: userId
    });
    if (!newFile) {
        return res.status(500).json({ error: "Failed to create file" });
    }
    // set Location header to new file URL
    res.set('Location', `/api/files/${newFile.id}`);
    return res.status(201).send();
}

function getFile(req, res) {
    // check for user id in header - in real app we would use authentication middleware with tokens
    const userId = req.get("X-User-Id");
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // get file by id
    const { id } = req.params;
    const file = getFileModel(id);

    // check if file exists and belongs to the user
    if (!file || file.ownerId !== userId) {
        return res.status(404).json({ error: "File not found" });
    }
    return res.status(200).json({ 
        id: file.id,
        name: file.name,
        type: file.type,
        parentId: file.parentId
    });
}      

function updateFile(req, res) {
    // check for user id in header - in real app we would use authentication middleware with tokens
    const userId = req.get("X-User-Id");
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // get file id from params and new name from body
    const { id } = req.params;
    const { name } = req.body || {};

    // validate new name
    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: "Name is required" });
    }
    const file = getFileModel(id);
    if (!file || file.ownerId !== userId) {
        return res.status(404).json({ error: "File not found" });
    }
    const updatedFile = updateFileModel(id, name.trim());

    if (!updatedFile || updatedFile.ownerId !== userId) {
        return res.status(404).json({ error: "File not found" });
    }
    return res.status(204).send();
}

function deleteFile(req, res) {
    // check for user id in header - in real app we would use authentication middleware with tokens
    const userId = req.get("X-User-Id");
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    // get file id from params
    const { id } = req.params;
    const file = getFileModel(id);
    if (!file || file.ownerId !== userId) {
        return res.status(404).json({ error: "File not found" });
    }
    const deleted = deleteFileModel(id);

    // check if file existed and belonged to the user
    if (!deleted || deleted.ownerId !== userId) {
        return res.status(404).json({ error: "File not found" });
    }
    return res.status(204).send();
}
module.exports = { listFiles, createFile, getFile, updateFile, deleteFile };
  
  
