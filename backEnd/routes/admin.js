const express = require("express");
const { getUsers, updateUser } = require("../controllers/admin.js");

const router = express.Router();

router.get("/getUsers", getUsers);
router.patch("/updateUser", updateUser);

module.exports = router;
