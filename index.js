require("dotenv").config();
const express = require("express");
const router = require("./src/routes/userRouters");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const errorHandler = require("./src/middleware/errorHandler");

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);
app.use(errorHandler);
app.use("/api", router);

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const db = async () => {
  await prisma.$connect();
  console.log("Database connected");
};
db();

module.exports = server;
