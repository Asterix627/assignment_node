const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const absenMasukController = async (req, res, next) => {
  try {
    const userId = req.user.id; // asumsi bahwa user sudah terverifikasi dan ID tersedia di req.user
    const tanggalMasuk = new Date(); // waktu saat ini

    const absen = await prisma.absen.update({
      where: {
        userId: userId
      },
      data: {
        tanggalMasuk: tanggalMasuk
      }
    });

    if (!absen) {
      return res.status(404).json({ message: "Absen gagal." });
    }

    res.json({ message: "Absen masuk berhasil dicatat.", absen });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  absenMasukController
};
