const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({ message: "Email tidak ditemukan." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password salah." });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '24h'
    });

    await prisma.user.update({
      where: { id: user.id },
      data: { token }
    });

    res.json({ message: "Login berhasil.", token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginController
};


