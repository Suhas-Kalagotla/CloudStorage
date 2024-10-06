const express = require("express");
const { getUsers, updateUser, deleteUser } = require("../controllers/admin.js");
const { createUserFolder } = require("../controllers/folder.js");

const router = express.Router();

router.get("/getUsers", getUsers);
router.patch("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);
router.post("/createUserFolder", createUserFolder);

module.exports = router;
