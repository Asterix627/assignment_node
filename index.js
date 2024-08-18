require("dotenv").config();
const express = require("express");
const userRouters = require("./src/routes/userRouters");
const absenRouters = require("./src/routes/absenRouter");
const authRouters = require("./src/routes/authRouter")
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(authRouters, userRouters, absenRouters);
app.use(errorHandler);
app.use("/api", authRouters, userRouters, absenRouters);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const db = async () => {
  await prisma.$connect();
  console.log("Database connected");
};
db();

module.exports = server;
