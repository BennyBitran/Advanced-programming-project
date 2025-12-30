const express = require("express");

const usersRoutes = require("./routes/users");
const tokensRoutes = require("./routes/tokens");
const filesRoutes = require("./routes/files");
const searchRoutes = require("./routes/search");

const app = express();

app.use(express.json());

// Return JSON (not HTML) on invalid JSON body
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next(err);
});

// API routes
app.use("/api/users", usersRoutes);
//app.use("/api/tokens", tokensRoutes);
app.use("/api/files", filesRoutes);
//app.use("/api/search", searchRoutes);

// 404 JSON for /api/*
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

module.exports = app;
