const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { insertUser, getUserByEmail } = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const role = "validate";
    insertUser(userName, email, passwordHash, role, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Database Error", details: err });
      }
      if (result.affectedRows === 0) {
        return res
          .status(409)
          .json({ error: "User with this email already exists" });
      }
      res
        .status(201)
        .json({ message: "User registered successfully waiting for approval" });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    getUserByEmail(email, async (err, user) => {
      if (err) {
        return res.status(500).json({ error: "Database Error", details: err });
      }
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );
      res.status(200).json({ message: "Login Successfull", token,user });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { register, login };