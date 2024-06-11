const validateUserInput = (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  if (!firstName || !lastName || !email || !password || !role) {
    return res.status(400).json({ message: "Semua field harus diisi." });
  }

  if (typeof firstName !== "string" || typeof lastName !== "string") {
    return res
      .status(400)
      .json({ message: "Nama depan dan belakang harus berupa huruf." });
  }

  if (!email.includes("@")) {
    return res.status(400).json({ message: "Email harus valid." });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password harus memiliki minimal 6 karakter." });
  }

  if (!["admin", "user"].includes(role)) {
    return res.status(400).json({ message: "Role harus 'admin' atau 'user'." });
  }

  next();
};

module.exports = {
  validateUserInput,
};
