const { listFiles: listFilesModel,
    createFile: createFileModel,
    getFile: getFileModel,
    updateFile: updateFileModel,
    deleteFile: deleteFileModel,
    starFile: starFileModel,
    unstarFile: unstarFileModel,
    getFileMetadata: getFileMetadata } = require("../models/files");

//list all files for the authenticated user, optionally filtered by parentId (null for root files)
function listFiles(req, res) {
    const { parentId, view } = req.query; // "trash", "starred", etc....

    // returns all files with the relevent filters
    const rawFiles = listFilesModel(req.user.id, parentId, view);

    const files = rawFiles.map(file => ({
        id: file.id,
        name: file.name,
        type: file.type,
        parentId: file.parentId,
        isTrashed: file.isTrashed,
        creationTime: file.creationTime,
        isStarred: (file.starredBy || []).includes(req.user.id),
        lastUpdateTime: file.lastUpdateTime,
        lastOpenedTime: file.lastOpenedTime
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
    
    if (req.body.restore === true) { file.isTrashed = false; }

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

function starFile(req, res) {
  try { starFileModel(req.params.id, req.user.id); return res.status(204).send(); }
  catch (err) { return res.status(err.status || 500).json({ error: err.message || "Failed to star file" }); }
}

function unstarFile(req, res) {
  try { unstarFileModel(req.params.id, req.user.id); return res.status(204).send(); }
  catch (err) { return res.status(err.status || 500).json({ error: err.message || "Failed to unstar file" }); }
}



module.exports = { listFiles, createFile, getFile, updateFile, deleteFile, starFile, unstarFile };

