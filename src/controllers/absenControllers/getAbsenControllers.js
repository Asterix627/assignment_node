const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAbsenControllers = async (req, res, next) => {
  const absen = await prisma.absen.findMany();
  res.status(200).json(absen);
};

const getAbsenByUserId = async (req, res, next) => {
  const userId = req.params.id;
  console.log(userId);
  const absen = await prisma.absen.findMany({ where: { userId: userId } });
  res.status(200).json(absen);
};

module.exports = {
  getAbsenControllers,
  getAbsenByUserId,
};
