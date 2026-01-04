const { searchFiles } = require('../services/fileSearchService');

async function search(req, res) {
     const userId = req.get("X-User-Id");
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    const query = req.params.query;

    try {
        const results =await searchFiles(query, userId);
        return res.status(200).json(results);
      } catch (e) {
        return res.status(500).json({ error: e.message || 'Search failed' });
    }
}

module.exports = { search }