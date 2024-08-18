const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const idGenerator = require("../../utils/IdGenerator");

const absenControllers = {
  getAllAbsen : async (req, res, next) => {
    const absen = await prisma.absen.findMany();
    res.status(200).json(absen);
  },
  
  getAbsenByUserId : async (req, res, next) => {
    const userId = req.params.id;
    const absen = await prisma.absen.findMany({ where: { userId: userId } });
    res.status(200).json(absen);
  },

  absenMasuk : async (req, res, next) => {
    try {
      const userId = req.user.id;
      const absenId = idGenerator("ABS");
      const waktuUTC = new Date();
      const waktuMasuk = new Date(waktuUTC.getTime() + 7 * 60 * 60 * 1000); // Menambahkan 7 jam ke waktu UTC
  
      // Ambil user dari tabel user
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User tidak ditemukan." });
      }
  
      // Cek apakah user sudah absen hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set waktu ke awal hari
  
      const absenHariIni = await prisma.absen.findFirst({
        where: {
          userId: userId,
          waktuMasuk: {
            gte: today,
          },
        },
      });
  
      if (absenHariIni) {
        return res.status(400).json({ message: "Anda sudah absen hari ini." });
      }
  
      // Buat data absen baru dengan mengambil nama dari tabel user
      const absen = await prisma.absen.create({
        data: {
          id : absenId,
          userId: userId,
          name: user.firstName + " " + user.lastName, // Menggabungkan nama depan dan nama belakang
          waktuMasuk: waktuMasuk,
        },
      });
  
      res.json({ message: "Absen masuk berhasil dicatat.", absen });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = absenControllers;
