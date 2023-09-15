const express = require("express");
const router = express.Router();
const blogsController = require("../controllers/blogs");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
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

router.get("/", jwtToken.logger, async (req, res) => {
  const user = req.userId;
  // console.log(user);
  const api = await axios.get("http://localhost:3000/blogs");
  const blogs = await api.data;
  res.render("blogs", { blogs, user });
});

router.route("/createBlog").post(jwtToken.logger, upload.single("image"),blogsController.createBlog);

router.get("/delete/:id", blogsController.deleteBlogById);

const dbFilePath = path.join(__dirname, "..", "db.json");
const jsonData = JSON.parse(fs.readFileSync(dbFilePath, "utf8"));


router.get("/edit/:id", blogsController.updateBlog);

router.post("/edit/:id", blogsController.postUpdate);

module.exports = router;
