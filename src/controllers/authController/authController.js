const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
  login: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: "Email tidak ditemukan." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Password salah." });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        {
          expiresIn: "365d",
        }
      );

      // Save the token in the auth table
      const authRecord = await prisma.auth.create({
        data: {
          id: user.id,
          token: token,
        },
      });

      // Create or update UserAuth relation
      await prisma.userAuth.upsert({
        where: { userId_authId: { userId: user.id, authId: authRecord.id } },
        update: { authId: authRecord.id },
        create: {
          userId: user.id,
          authId: authRecord.id,
        },
      });

      res.json({ message: "Login berhasil.", token });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
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
  },
};

module.exports = authController;
