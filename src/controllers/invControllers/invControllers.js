require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const errorHandler = require("../../middleware/errorHandler");
const idGenerator = require("../../utils/IdGenerator");

const invControllers = {
  createInventory: async (req, res, next) => {
    try {
      const { namaInv, kodeInv, tanggalPengadaan, kategoriNama } = req.body;

      // Cari kategori berdasarkan nama kategori yang diberikan
      const kategori = await prisma.kategori.findMany({
        where: { namaKat: kategoriNama },
      });

      // Periksa apakah kategori ditemukan dan ambil ID kategori dari elemen pertama
      if (kategori.length === 0) {
        return res.status(404).json({ message: "Kategori tidak ditemukan." });
      }

      const validTanggalPengadaan = new Date(tanggalPengadaan).toISOString();

      const idKat = kategori[0].id; // Ambil ID dari kategori pertama

      // Buat ID untuk inventaris baru
      const idInv = idGenerator("INV");

      // Buat inventaris baru dengan kategoriId yang ditemukan
      const inventory = await prisma.inventaris.create({
        data: {
          id: idInv,
          namaInv: namaInv,
          kodeInv: kodeInv,
          tanggalPengadaan: validTanggalPengadaan,
          kategoriId: idKat, // Menggunakan id dari kategori yang ditemukan
        },
      });

      res
        .status(201)
        .json({ message: "Inventaris berhasil diinput", inventory: inventory });
    } catch (error) {
      next(error);
    }
  },

  getInventory: async (req, res, next) => {
    try {
      const inventory = await prisma.inventaris.findMany();
      res.json(inventory);
    } catch (error) {
      next(error);
    }
  },

  getDetailInventory: async (req, res, next) => {
    try {
      const inventory = await prisma.inventaris.findUnique(
        {where:
          {id: req.params.id}
          }
      );
      res.json(inventory);
    } catch (error) {
      next(error);
    }
  },

  updateInventory: async (req, res, next) => {
    try {
      const { namaInv, kodeInv, tanggalPengadaan, kategoriNama } = req.body;

      // Cari kategori berdasarkan nama kategori yang diberikan
      const kategori = await prisma.kategori.findMany({
        where: { namaKat: kategoriNama },
      });

      // Periksa apakah kategori ditemukan dan ambil ID kategori dari elemen pertama
      if (kategori.length === 0) {
        return res.status(404).json({ message: "Kategori tidak ditemukan." });
      }

      const validTanggalPengadaan = new Date(tanggalPengadaan).toISOString();

      const idKat = kategori[0].id; // Ambil ID dari kategori pertama

      const idInv = req.params.id;

      const inventory = await prisma.inventaris.update({
        where: { id: idInv },
        data: {
          id: idInv,
          namaInv: namaInv,
          kodeInv: kodeInv,
          tanggalPengadaan: validTanggalPengadaan,
          kategoriId: idKat, // Menggunakan id dari kategori yang ditemukan
        },
      });

      res
        .status(201)
        .json({ message: "Inventaris berhasil diupdate", inventory: inventory });
    } catch (error) {
      next(error);
    }
  },

  deleteInventory: async (req, res, next) => {
    try {
      const idInv = req.params.id;
      const inventory = await prisma.inventaris.delete({
        where: { id: idInv },
        });
        res.status(200).json({ message: "Inventaris berhasil dihapus", inventory: inventory });
      } catch (error) {
        next(error);
      }
    },
};

module.exports = invControllers;
