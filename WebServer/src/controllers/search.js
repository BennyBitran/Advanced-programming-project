const filesModel = require("../models/files");

async function search(req, res) {
    
        const userId = req.user.id ?? req.user.userId;
        const query = req.params.query;
        
    try {
        const results = await filesModel.searchFiles(query, userId);
        return res.status(200).json(results);
    } catch (e) {
        return res.status(500).json({ error: "Search failed" });
    }
}

module.exports = { search }