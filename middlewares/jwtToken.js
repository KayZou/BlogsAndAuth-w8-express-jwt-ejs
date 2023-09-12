require("dotenv").config();
const jwt = require("jsonwebtoken");

const logger = (req, res, next) => {
  const token = req.cookies.token_auth;
// console.log(req);
  if (!token) {
    return res.redirect("/users/register");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const { username, image } = decoded;
    req.username = username;
    req.image = image; // You can uncomment this line if needed
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return res.status(401).json({ message: err.message});
  }
};

module.exports = { logger };
