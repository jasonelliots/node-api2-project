const express = require("express");

const postsRouter = require("./posts/posts-router.js"); // 

const server = express();

server.use(express.json());

server.get("/", (req, res) => {
    res.send(`
    <h2>Users API</h>
  `);
});

server.use("/api/posts", postsRouter);

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`\n*** Server Running on http://localhost:${PORT} ***\n`);
});