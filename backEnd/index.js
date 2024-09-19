const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/verifyToken.js"); 
const authenticationRoutes = require("./routes/authenticationRoutes.js");
const adminRoutes = require("./routes/admin.js");
const app = express();
require("dotenv").config();

app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/auth", authenticationRoutes);
app.use("/admin", verifyToken, adminRoutes);

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
