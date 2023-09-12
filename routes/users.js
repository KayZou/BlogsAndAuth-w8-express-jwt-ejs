const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");
const jwtToken = require("../middlewares/jwtToken");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = file.originalname.split(".").pop();
    cb(null, uniquePrefix + "." + ext);
  },
});

// Set up Multer upload
const upload = multer({ storage: storage });

router.post("/register", upload.single("image"), userController.createUser);

router.post("/login", userController.authenticateUser);

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/dashboard", jwtToken.logger, (req, res) => {
  // console.log(req)
  res.render("dashboard", { username: req.username, image: req.image });
});

module.exports = router;
