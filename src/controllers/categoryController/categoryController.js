require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const errorHandler = require("../../middleware/errorHandler");
const idGenerator = require("../../utils/IdGenerator");

const categoryControllers = {
  createCategory: async (req, res, next) => {
    try {
      const { namaKat } = req.body;

      const kategoriId = idGenerator("KAT");
      const category = await prisma.kategori.create({
        data: {
          id: kategoriId,
          namaKat: namaKat,
        },
      });
      res
        .status(201)
        .json({ message: "Kategori berhasil diinput", user: category });
    } catch (error) {
      next(error);
    }
  },

  getAllCategory: async (req, res, next) => {
    try {
      const categories = await prisma.kategori.findMany();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  },

  getCategoryById: async (req, res, next) => {
  try {
    const katId = req.params.id;
    const categoriesById = await prisma.kategori.findMany({
      where: { id: katId },
    });

    // Cek apakah hasilnya kosong
    if (categoriesById.length === 0) {
      return res.status(404).json({ message: "Kategori tidak ditemukan" });
    }

    console.log(categoriesById);

    res.json(categoriesById);
  } catch (error) {
    next(error);
  }
},

  updateCategory: async (req, res, next) => {
    try {
      const { namaKat } = req.body;
      const katId = req.params.id;
      
      const category = await prisma.kategori.update({
        where: { id: katId },
        data: { namaKat: namaKat },
      });
      res.json(category);
    } catch (error) {
      next(error);
    }
  },

  deleteCategory: async (req, res, next) => {
    try {
      const katId = req.params.id;
      await prisma.kategori.delete({ where: { id: katId } });
      res.json({ message: "Kategori berhasil dihapus" });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryControllers;
