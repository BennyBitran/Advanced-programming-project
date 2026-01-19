const { listFiles: listFilesModel,
    createFile: createFileModel,
    getFile: getFileModel,
    renameFile: renameFile,
    deleteFile: deleteFileModel,
    getFileMetadata: getFileMetadata,
    writeFileContent: writeFileContent,
    starFile,
    unstarFile } = require("../models/files");

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
    try {
        const { name, content, isStarred } = req.body;
        const fileId = req.params.id;
        const userId = req.user.id;

        // fetch to ensure file exists and user has base permissions
        let updatedFile = await getFileMetadata(fileId);

        if (name !== undefined) {
            updatedFile = await renameFile(fileId, userId, name);
        }

        if (content !== undefined) {
            updatedFile = await writeFileContent(fileId, userId, content);
        }

        if (isStarred !== undefined) {
            updatedFile = isStarred ? await starFile(fileId, userId) : await unstarFile(fileId, userId);
        }

        res.status(200).json(updatedFile);

    } catch (err) {
        console.error(`Error updating file ${req.params.id}:`, err);

        res.status(err.status || 500).json({
            error: err.message || "Failed to update file"
        });
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

