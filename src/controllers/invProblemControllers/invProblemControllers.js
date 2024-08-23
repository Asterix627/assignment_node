require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const errorHandler = require("../../middleware/errorHandler");
const idGenerator = require("../../utils/IdGenerator");

const invProblemControllers = {
  createProblem: async (req, res, next) => {
    try {
      const { tanggal, inventarisId, masalah, status } = req.body;
      const pelaporId = req.user.id; // Ambil ID pelapor dari req.user

      // Generate ID untuk masalah
      const problemId = idGenerator("TRO");

      // Cari inventaris berdasarkan inventarisId
      const IdInv = await prisma.inventaris.findUnique({
        where: {
          id: inventarisId,
        },
      });

      // Periksa apakah inventaris ditemukan
      if (!IdInv) {
        return res.status(404).json({ message: "Inventaris tidak ditemukan." });
      }

      // Cari pengguna berdasarkan pelaporId
      const userId = await prisma.user.findUnique({
        where: {
          id: pelaporId,
        },
      });

      const validTanggal = new Date(tanggal).toISOString();

      // Periksa apakah pengguna ditemukan
      if (!userId) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan." });
      }

      // Buat entri masalah baru
      const problem = await prisma.invTrouble.create({
        data: {
          id: problemId,
          tanggal: validTanggal,
          inventarisId: IdInv.id, // Gunakan ID inventaris
          masalah,
          pelaporId: userId.id, // Gunakan ID pengguna
          status,
        },
      });

      res.status(201).json({ message: "Problem telah diinput", problem });
    } catch (error) {
      next(error);
    }
  },

  getProblems: async (req, res, next) => {
    try {
      const problems = await prisma.invTrouble.findMany();
      res.json(problems);
    } catch (error) {
      next(error);
    }
  },

  getProblemsByInv: async (req, res, next) => {
    try {
      const inventarisId = req.params.id;
      console.log(inventarisId);

      // Cari semua masalah berdasarkan inventarisId
      const problems = await prisma.invTrouble.findMany({
        where: {
          inventarisId: inventarisId,
        },
        include: {
          inventaris: true,
          pelapor: true,
        },
      });

      console.log(problems);

      if (problems.length === 0) {
        return res.status(404).json({
          message: "Tidak ada masalah ditemukan untuk inventaris ini.",
        });
      }

      res
        .status(200)
        .json({ message: "Detail masalah berhasil diambil", problems });
    } catch (error) {
      next(error);
    }
  },

  getDetailProblem: async (req, res, next) => {
    try {
      const problemId = req.params.id;

      const problems = await prisma.invTrouble.findMany({
        where: {
          id: problemId,
        },
      });
      res
        .status(200)
        .json({ message: "Detail masalah berhasil diambil", problems });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const problemId = req.params.id;
      const status = req.body.status;
      const statusUpdate = await prisma.invTrouble.update({
        where: { id: problemId },
        data: {
          status: status,
        },
      });
      res.status(200).json({
        message: "Status berhasil di update",
        statusUpdate: statusUpdate,
      });
    } catch (error) {
      next(error);
    }
  },

  editDetailProblems: async (req, res, next) => {
    try {
      const { tanggal, masalah, status } = req.body;
      const problemId = req.params.id;

      // Cari masalah berdasarkan problemId
      const problem = await prisma.invTrouble.findUnique({
        where: { id: problemId },
        include: { inventaris: true }, // Pastikan inventaris termasuk dalam hasil
      });

      // Periksa apakah masalah ditemukan
      if (!problem) {
        return res.status(404).json({ message: "Masalah tidak ditemukan" });
      }

      // Ambil inventarisId dari data masalah yang ditemukan
      const inventarisId = problem.inventaris.id;

      // Validasi tanggal
      const validTanggal = new Date(tanggal).toISOString();

      // Update data masalah
      const problemUpdate = await prisma.invTrouble.update({
        where: { id: problemId },
        data: {
          tanggal: validTanggal,
          inventarisId: inventarisId, // Gunakan inventarisId dari data yang ditemukan
          masalah: masalah,
          status: status,
        },
      });

      res.status(200).json({
        message: "Masalah berhasil diupdate",
        problemUpdate: problemUpdate,
      });
    } catch (error) {
      next(error);
    }
  },

  problemsDone: async (req, res, next) => {
    try {
      const problemId = req.params.id;
      const { status } = req.body;

      // Validasi status yang diterima
      const validStatuses = ["Done", "RepairNeeded"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          message:
            "Status tidak valid. Status yang diperbolehkan adalah 'Done' atau 'RepairNeeded'.",
        });
      }

      // Update masalah dengan status baru
      const updatedProblem = await prisma.invTrouble.update({
        where: { id: problemId },
        data: {
          status: status,
        },
      });

      // Mengirimkan respons berdasarkan status
      let responseMessage;
      if (status === "Done") {
        responseMessage = "Masalah telah diselesaikan";
      } else if (status === "RepairNeeded") {
        responseMessage = "Perlu perbaikan lebih lanjut";
      }

      res.status(200).json({
        message: responseMessage,
        done: updatedProblem,
      });
    } catch (error) {
      next(error); // Arahkan error ke middleware error handler
    }
  },

  deleteProblems: async (req, res, next) => {
    try {
      const problemId = req.params.id;
      const deletedProblem = await prisma.invTrouble.delete({
        where: { id: problemId },
      });
      res
        .status(200)
        .json({ message: "Masalah telah dihapus", deleted: deletedProblem });
    } catch (error) {
      next(error); // Arahkan error ke middleware error handler
    }
  },
};

module.exports = invProblemControllers;
