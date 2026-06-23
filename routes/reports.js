const express = require("express");
const db = require("../database/db");
const multer = require("multer");
const path = require("path");

const router = express.Router();

/* =========================
   MULTER SETUP
========================= */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

/* =========================
   CREATE REPORT
========================= */
router.post("/", upload.single("foto"), (req, res) => {
    const { user_id, judul, kategori, lokasi, deskripsi, urgensi } = req.body;

    const foto = req.file ? "/uploads/" + req.file.filename : null;

    db.run(
        `
        INSERT INTO reports
        (user_id, judul, kategori, lokasi, deskripsi, urgensi, foto, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
            user_id,
            judul,
            kategori,
            lokasi,
            deskripsi,
            urgensi,
            foto,
            "Dilaporkan"
        ],
        function(err){
            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message: "Laporan berhasil dikirim"
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
        SELECT *
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