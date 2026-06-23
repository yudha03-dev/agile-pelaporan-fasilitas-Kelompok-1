const express = require("express");
const db = require("../database/db");

const router = express.Router();

/* =========================
   CREATE REPORT
========================= */
router.post("/", (req, res) => {
    const {
        user_id,
        judul,
        kategori,
        lokasi,
        deskripsi,
        urgensi
    } = req.body;

    if (
        !user_id ||
        !judul ||
        !kategori ||
        !lokasi ||
        !deskripsi ||
        !urgensi
    ) {
        return res.status(400).json({
            message: "Semua field wajib diisi"
        });
    }

    db.run(
        `
        INSERT INTO reports
        (user_id, judul, kategori, lokasi, deskripsi, urgensi, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            judul,
            kategori,
            lokasi,
            deskripsi,
            urgensi,
            "Dilaporkan"
        ],
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
        SELECT 
            id,
            user_id,
            judul,
            kategori,
            lokasi,
            deskripsi,
            urgensi,
            status,
            created_at
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

    db.run(
        `
        UPDATE reports
        SET status = ?
        WHERE id = ?
        `,
        [status, req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Status berhasil diperbarui"
            });
        }
    );
});

/* =========================
   DELETE REPORT
========================= */
router.delete("/:id", (req, res) => {
    db.run(
        `
        DELETE FROM reports
        WHERE id = ?
        `,
        [req.params.id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Laporan berhasil dihapus"
            });
        }
    );
});

module.exports = router;