require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const errorHandler = require("../../middleware/errorHandler");
const idGenerator = require("../../utils/IdGenerator");

const userController = {
  getUsers: async (req, res, next) => {
    try {
      const users = await prisma.user.findMany();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  getDetailUsers: async (req, res, next) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
      });
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req, res, next) => {
    try {
      const { firstName, lastName, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 12);
      console.log(req.body);

      // const userRole = role || "user";
      const idUser = idGenerator("USR");
      const users = await prisma.user.create({
        data: {
          id: idUser,
          firstName,
          lastName,
          email,
          password: hashedPassword,
          // role: userRole,
        },
      });
      res.status(201).json({ message: "Registration Success", user: users });
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req, res, next) => {
    try {
      const { firstName, lastName, email } = req.body;
      const user = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          firstName,
          lastName,
          email,
        },
      });
      res.status(200).json({ message: "User updated", user });
    } catch (error) {
      next(error);
    }
  },

  updateRole: async (req, res, next) => {
    const userId = req.params.id;
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { role: "Admin" },
      });
      res.status(200).json("Role updated successfully.");
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req, res, next) => {
    const userId = req.params.id;
    try {
      await prisma.$transaction(async (prisma) => {
        // Hapus catatan yang terkait dari tabel absen
        await prisma.absen.deleteMany({
          where: { userId: userId },
        });
  
        // Hapus catatan yang terkait dari tabel UserAuth
        await prisma.userAuth.deleteMany({
          where: { userId: userId },
        });
  
        // Hapus catatan yang terkait dari tabel InvTrouble
        await prisma.invTrouble.deleteMany({
          where: { pelaporId: userId },
        });
  
        // Setelah data terkait dihapus, hapus pengguna dari tabel User
        await prisma.user.delete({
          where: { id: userId },
        });
      });
  
      res.status(200).json("User deleted successfully.");
    } catch (error) {
      next(error);
    }
  }  
};

module.exports = userController;
