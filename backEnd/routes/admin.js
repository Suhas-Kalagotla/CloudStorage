const express = require("express");
const { getUsers } = require("../controllers/admin.js");

const router = express.Router();

router.get("/getUsers", getUsers);

module.exports = router;
