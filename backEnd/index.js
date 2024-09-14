const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authenticationRoutes = require("./routes/authenticationRoutes.js");
const app = express();
require("dotenv").config(); 

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/auth", authenticationRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
