require("dotenv").config();
const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const utils = require("../utils/utils");
const jwtToken = require("../middlewares/jwtToken");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const getAllBlogs = (req, res) => {
  // const response = axios.get("http://localhost:3000/blogs");
  // res.send({
  //   data: response.data,
  // });
};
const createBlog = (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.userId;
    const blogId = uuidv4();
    // console.log(req.body);
    const newBlog = {
      title,
      content,
      userId,
      blogId,
    };
    axios
      .post("http://localhost:3000/blogs", newBlog)
      .then(() => {
        res.redirect("http://localhost:4001/blogs/");
      })
      .catch((error) => {
        res.status(500).send("Internal server error");
      });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};
const dbFilePath = path.join(__dirname, "..", "db.json");
function findBlogById(blogId) {
  const jsonData = JSON.parse(fs.readFileSync(dbFilePath, "utf8"));
  return jsonData.blogs.find((blog) => blog.id === blogId);
}

const deleteBlogById = (req, res) => {
  const blogIdToDelete = parseInt(req.params.id);
  try {
    const data = fs.readFileSync(dbFilePath, "utf8");
    const jsonData = JSON.parse(data);

    const blogIndexToDelete = jsonData.blogs.findIndex(
      (blog) => blog.id === blogIdToDelete
    );

    if (blogIndexToDelete !== -1) {
      jsonData.blogs.splice(blogIndexToDelete, 1);

      fs.writeFileSync(dbFilePath, JSON.stringify(jsonData, null, 2), "utf8");

      res.redirect("/blogs");
    } else {
      // Send a not found response
      res.status(404).json({ message: "Blog not found" });
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    // Send an internal server error response
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateBlog = async (req, res) => {
  const blogId = parseInt(req.params.id);
  const blogToUpdate = findBlogById(blogId);

  if (!blogToUpdate) {
    return res.status(404).json({ message: "Blog not found" });
  }
  res.render("edit", { blog: blogToUpdate });
};

const postUpdate = (req, res) => {
  const blogId = parseInt(req.params.id);
  const updatedTitle = req.body.title;
  const updatedContent = req.body.content;

  const dbFilePath = path.join(__dirname, "..", "db.json");

  fs.readFile(dbFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading JSON file:", err);
      res.status(500).send("Internal server error");
      return;
    }
    try {
      const jsonData = JSON.parse(data);
      const blogIndex = jsonData.blogs.findIndex((blog) => blog.id === blogId);
      if (blogIndex === -1) {
        // Blog not found
        res.status(404).json({ message: "Blog not found" });
        return;
      }
      jsonData.blogs[blogIndex].title = updatedTitle;
      jsonData.blogs[blogIndex].content = updatedContent;
      fs.writeFile(
        dbFilePath,
        JSON.stringify(jsonData, null, 2),
        "utf8",
        (err) => {
          if (err) {
            console.error("Error writing JSON file:", err);
            res.status(500).send("Internal server error");
            return;
          }

          res.redirect(`/blogs`);
        }
      );
    } catch (error) {
      console.error("Error parsing JSON:", error);
      res.status(500).send("Internal server error");
    }
  });
};

module.exports = {
  getAllBlogs,
  createBlog,
  deleteBlogById,
  updateBlog,
  postUpdate,
};