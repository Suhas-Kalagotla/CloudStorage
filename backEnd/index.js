const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authenticationRoutes = require("./routes/authenticationRoutes.js");
const adminRoutes = require("./routes/admin.js");
const userRoutes = require("./routes/user.js");
const { verifyToken, authorizeRole, verifyOwner } = require("./middleware");
const app = express();
require("dotenv").config();

app.use(cookieParser());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.URL],
    credentials: true,
  }),
);

app.use("/auth", authenticationRoutes);
app.use("/admin", verifyToken, authorizeRole(["admin"]), adminRoutes);
app.use("/user", verifyToken, authorizeRole(["user", "admin"]), userRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 3001");
});
