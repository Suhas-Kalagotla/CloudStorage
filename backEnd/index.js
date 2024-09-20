const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authenticationRoutes = require("./routes/authenticationRoutes.js");
const adminRoutes = require("./routes/admin.js");
const app = express();
require("dotenv").config();

app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use("/auth", authenticationRoutes);
app.use("/admin", adminRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3001");
});
