require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

const posts = [
  {
    username: "Durai",
    title: "HELLO",
  },
 
];

app.get("/posts", auth, (req, res) => {
  // console.log(req.user.name);
  res.json(posts.filter((post) => post.username === req.user.name));
});

function auth(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

console.log("Working");
app.listen(3000);
