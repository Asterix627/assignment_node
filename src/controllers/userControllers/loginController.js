const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginController = async (req, res, next) => {
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
};

module.exports = {
  loginController,
};
