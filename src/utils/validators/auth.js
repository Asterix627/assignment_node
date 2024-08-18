const validateInput = {
  register: (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
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
    next();
  },

  login: (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Semua field harus diisi." });
    }

    if (!email.includes("@")) {
      return res.status(400).json({ message: "Email harus valid." });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password harus memiliki minimal 6 karakter." });
    }
    next();
  },
};

module.exports = validateInput;
