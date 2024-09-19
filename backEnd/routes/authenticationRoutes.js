const express = require("express");
const { register, login,logout } = require("../controllers/authentication.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
