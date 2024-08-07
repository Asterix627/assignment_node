const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const logoutController = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Temukan entry UserAuth berdasarkan userId
    const userAuth = await prisma.userAuth.findUnique({
      where: { userId_authId: { userId: userId, authId: userId } },
      include: {
        auth: true, // Include related auth record
      },
    });

    if (!userAuth) {
      return res.status(404).json({ message: "UserAuth tidak ditemukan." });
    }

    // Update token menjadi null di tabel auth
    await prisma.auth.update({
      where: { id: userAuth.authId },
      data: { token: null },
    });

    res.status(200).json({ message: "Logout berhasil." });
  } catch (error) {
    next(error);
  } finally {
    // Pastikan koneksi Prisma ditutup setelah operasi selesai
    await prisma.$disconnect();
  }
};

module.exports = { logoutController };

