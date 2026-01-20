const filesModel = require("../models/files");

async function search(req, res) {
    try {
        const userId = req.user.id ?? req.user.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const query = req.params.query;
        const results = await filesModel.searchFiles(query, userId);
        return res.status(200).json(results);
    } catch (e) {
        return res.status(500).json({ error: "Search failed" });
    }
}

module.exports = { search }