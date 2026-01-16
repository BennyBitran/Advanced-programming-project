const { listFiles: listFilesModel,
    createFile: createFileModel,
    getFile: getFileModel,
    updateFile: updateFileModel,
    deleteFile: deleteFileModel,
    getFileMetadata: getFileMetadata } = require("../models/files");

//list all files for the authenticated user, optionally filtered by parentId (null for root files)
function listFiles(req, res) {
    //force parentId to be null if not provided, and convert to string otherwise
    const parentIdParam = req.query.parentId;
    const parentId = parentIdParam === undefined || parentIdParam === 'null'
        || parentIdParam === '' ? null : String(parentIdParam);

    // returns all files for the specified user only
    const rawFiles = listFilesModel(req.user.id, parentId);

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
    }

    try {
        const newFile = await createFileModel({
            name: name.trim(),
            ownerId: req.user.id,
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
    const fileId = req.params.id;
    if (!fileId) {
        return res.status(400).json({ error: "File id is required" });
    }

    try {
        const data = await getFileModel(fileId, req.user.id);
        res.status(200).json(data);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message });
    }
}


async function updateFile(req, res) {
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

    const { name, content } = req.body || {};

    try {
        await updateFileModel(fileId, req.user.id, { name, content });
        return res.status(204).send();
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message || "Failed to update file" });
    }
}

async function deleteFile(req, res) {
    const file = getFileMetadata(req.params.id);
    if (!file) return res.status(404).json({ error: "File not found" });

    try {
        await deleteFileModel(req.params.id, req.user.id);
        return res.status(204).send();
    } catch (err) {
        return res.status(err.status || 500).json({ error: err.message || "Failed to delete file" });
    }
}


module.exports = { listFiles, createFile, getFile, updateFile, deleteFile };


