require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

let refershTokens = [];

app.post("/token", (req, res) => {
  const refershToken = req.body.token;

  if (refershToken == null) return res.sendStatus(401);
  if (!refershTokens.includes(refershToken)) return res.sendStatus(403);

  jwt.verify(refershToken, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refershTokens = refershTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };

  const accessToken = generateToken(user);
  const refershToken = jwt.sign(user, process.env.REFRESH_TOKEN);
  refershTokens.push(refershToken);
  res.json({ accessToken: accessToken, refershToken: refershToken });
});

function generateToken(user) {
  return jwt.sign(user, process.env.SECRET, { expiresIn: "20s" });
}

console.log("Working");
app.listen(5000);
