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
                }
            });

            // Periksa apakah inventaris ditemukan
            if (!IdInv) {
                return res.status(404).json({ message: "Inventaris tidak ditemukan." });
            }

            // Cari pengguna berdasarkan pelaporId
            const userId = await prisma.user.findUnique({
                where: {
                    id: pelaporId,
                }
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
                    status
                }
            });

            res.status(201).json({ message: "Problem telah diinput", problem });
        } catch (error) {
            next(error); // Arahkan error ke middleware error handler
        }
    }
};

module.exports = invProblemControllers;
