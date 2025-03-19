const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authenticationRoutes = require("./routes/authenticationRoutes.js");
const adminRoutes = require("./routes/admin.js");
const userRoutes = require("./routes/user.js");
const { verifyToken, authorizeRole } = require("./middleware");
const app = express();
require("dotenv").config();

app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.URL],
    credentials: true,
  }),
);

app.use("/api/auth", authenticationRoutes);
app.use("/api/admin", verifyToken, authorizeRole(["admin"]), adminRoutes);
app.use("/api/user", verifyToken, authorizeRole(["user", "admin"]), userRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
