
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require('../models/User');

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.cookies.accessToken;

  // Check if no token
  if (!token) {
    return res.status(403).json({ message: "Authorization denied", success: false });
  }

  // Verify token
  try {
    //it is going to give use the user id (user:{id: user.id})
    const verify = jwt.verify(token, process.env.jwtSecret);
    const userExists = await User.exists({ _id: verify.user.id });

    if (userExists) {
      next();
    } else {
      res.json({
        message: "Authorization denied",
        success: false
      }).status(403)
    }
  } catch (err) {
    res.status(403).json({ err, message: "Authorization denied", success: false });
  }
};