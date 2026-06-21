const express = require("express");
const db = require("../database/db");

const router = express.Router();

/* =========================
   CREATE REPORT
========================= */
router.post("/", (req, res) => {
    const { user_id, judul, lokasi, deskripsi } = req.body;

    if (!user_id || !judul || !lokasi || !deskripsi) {
        return res.status(400).json({
            message: "Semua field wajib diisi"
        });
    }

    db.run(
        `
        INSERT INTO reports (user_id, judul, lokasi, deskripsi, status)
        VALUES (?, ?, ?, ?, ?)
        `,
        [user_id, judul, lokasi, deskripsi, "Dilaporkan"],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.status(201).json({
                message: "Laporan berhasil dikirim",
                report_id: this.lastID,
                status: "Dilaporkan"
            });
        }
    );
});

/* =========================
   GET ALL REPORTS (ADMIN)
========================= */
router.get("/", (req, res) => {
    db.all(
        `
        SELECT *
        FROM reports
        ORDER BY created_at DESC
        `,
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
});

/* =========================
   GET REPORTS BY USER
========================= */
router.get("/user/:id", (req, res) => {
    const userId = req.params.id;

    db.all(
        `
        SELECT id, user_id, judul, lokasi, deskripsi, status, created_at
        FROM reports
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId],
        (err, rows) => {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
});

/* =========================
   UPDATE STATUS (ADMIN)
========================= */
router.put("/:id", (req, res) => {
    const { status } = req.body;
    const reportId = req.params.id;

    const allowedStatus = ["Dilaporkan", "Diproses", "Selesai"];

    if (!allowedStatus.includes(status)) {
        return res.status(400).json({
            message: "Status tidak valid"
        });
    }

    db.run(
        `
        UPDATE reports
        SET status = ?
        WHERE id = ?
        `,
        [status, reportId],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Laporan tidak ditemukan"
                });
            }

            res.json({
                message: "Status berhasil diperbarui",
                report_id: reportId,
                new_status: status
            });
        }
    );
});

/* =========================
   DELETE REPORT
========================= */
router.delete("/:id", (req, res) => {
    const reportId = req.params.id;

    db.run(
        `
        DELETE FROM reports
        WHERE id = ?
        `,
        [reportId],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    message: "Laporan tidak ditemukan"
                });
            }

            res.json({
                message: "Laporan berhasil dihapus"
            });
        }
    );
});

module.exports = router;