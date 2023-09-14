require("dotenv").config();
const jwt = require("jsonwebtoken");

const logger = (req, res, next) => {
  const token = req.cookies.token_auth;
  if (!token) {
    return res.redirect("/users/register");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { id:userId, username, image } = decoded;
    // console.log(decoded);
    req.username = username;
    req.image = image;
    req.userId = userId;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ message: err.message });
  }
};

const verifyUserId = (req, res, next) => {
  const token = req.params.id;
  const blogId = req.params.blogId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { userId } = decoded;

    if (userId !== blogId) {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.userId = userId;
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ message: err.message });
  }
};
const getUserIDFromToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  return decoded.userId;
};

const checkAuth = (req, res, next) => {
  const token = req.cookies.token_auth;
  if (token) {
    return res.redirect('/users/login');
  }
  next();
};

module.exports = { logger, verifyUserId, getUserIDFromToken, checkAuth };
