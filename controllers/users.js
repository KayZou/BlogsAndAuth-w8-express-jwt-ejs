require("dotenv").config();
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const cookies = require("cookie-parser");
const multer = require("multer");

const createUser = async (req, res) => {
  const { username, password } = req.body;
  const image = req.file.filename;
  const hashedPassword = await bcrypt.hash(password, 10);
  const response = await axios.post("http://localhost:3000/users", {
    username: username,
    password: hashedPassword,
    image,
  });
  res.redirect("/users/login");
};

const dbFilePath = path.join(__dirname, "../db.json");

const authenticateUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const data = await fs.promises.readFile(dbFilePath);
    const db = JSON.parse(data);

    const user = db.users.find((user) => user.username === username);

    if (!user) {
      console.log("User not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("Password does not match");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, image: user.image },
      process.env.JWT_SECRET_KEY
    );

    res.cookie("token_auth", token, { httpOnly: true });

    res.redirect("/users/dashboard");
  } catch (err) {
    console.error("Error reading file:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createUser,
  authenticateUser,
};
