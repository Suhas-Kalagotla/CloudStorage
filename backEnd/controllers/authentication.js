const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { insertUser, getUserByEmail } = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { email, userName, password } = req.body;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const role = "validate";
    const result = await insertUser(userName, email, passwordHash, role);
    if (result.affectedRows === 0) {
      return res
        .status(409)
        .json({ error: "User with this email or username already exists" });
    }
    res
      .status(201)
      .json({ message: "User registered successfully waiting for approval" });
  } catch (err) {
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    const user = await getUserByEmail(email);
    console.log(user);
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
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: process.env.NODE_ENV === "production",
    });
    delete user.password;
    res.status(200).json({
      message: "Login Successfull",
      token,
      user,
    });
  } catch (err) {
    console.error("Login Error: ", err);
    res.status(500).json({ error: "Database Error " + err.message });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
};

module.exports = { register, login, logout };
