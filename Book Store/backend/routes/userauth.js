const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.sendStatus(401).json({ message: "Unauthorized" });

  jwt.verify(token, "bookStore123", (err, user) => {
    if (err) return res.sendStatus(403).json({ message: "Forbidden" });
    req.user = user;
    next();
  });
};
module.exports = { authenticateToken };
