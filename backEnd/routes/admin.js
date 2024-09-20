const express = require("express");
const { getUsers } = require("../controllers/admin.js");
const verifyToken = require("../middleware/verifyToken.js");
const authorizeRole = require("../middleware/authorizeRole.js");

const router = express.Router();

router.get("/getUsers", verifyToken, authorizeRole(["admin"]), getUsers);

module.exports = router;
