const verifyOwner = (req, res, next) => {
  try {
    const user = req.user;
    next();
  } catch (err) {
       res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = verifyOwner;
