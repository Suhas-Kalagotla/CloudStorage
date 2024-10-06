const express = require("express");
const { getUsers, updateUser, deleteUser ,createUserFolder} = require("../controllers/admin.js");

const router = express.Router();

router.get("/getUsers", getUsers);
router.patch("/updateUser", updateUser);
router.delete("/deleteUser", deleteUser);
router.post("/createUserFolder", createUserFolder);

module.exports = router;
