const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const token =
    req.cookies.token || req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid Token" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ error: "Invalid Token" });
  }
};

module.exports = verifyToken;
