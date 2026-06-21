const express = require("express");
const db = require("../database/db");

const router = express.Router();

/* =========================
   DASHBOARD ADMIN
   Menampilkan semua laporan
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
                return res.status(500).send(err.message);
            }

            res.render("admin", {
                reports: rows
            });
        }
    );
});

/* =========================
   DETAIL LAPORAN
========================= */
router.get("/detail/:id", (req, res) => {
    const reportId = req.params.id;

    db.get(
        `
        SELECT *
        FROM reports
        WHERE id = ?
        `,
        [reportId],
        (err, row) => {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (!row) {
                return res.status(404).send("Laporan tidak ditemukan");
            }

            res.render("detail", {
                report: row
            });
        }
    );
});

/* =========================
   UPDATE STATUS LAPORAN
========================= */
router.post("/update-status/:id", (req, res) => {
    const reportId = req.params.id;
    const { status } = req.body;

    const allowedStatus = ["Dilaporkan", "Diproses", "Selesai"];

    if (!allowedStatus.includes(status)) {
        return res.status(400).send("Status tidak valid");
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
                return res.status(500).send(err.message);
            }

            if (this.changes === 0) {
                return res.status(404).send("Laporan tidak ditemukan");
            }

            res.redirect("/admin");
        }
    );
});

/* =========================
   HAPUS LAPORAN
========================= */
router.post("/delete/:id", (req, res) => {
    const reportId = req.params.id;

    db.run(
        `
        DELETE FROM reports
        WHERE id = ?
        `,
        [reportId],
        function (err) {
            if (err) {
                return res.status(500).send(err.message);
            }

            if (this.changes === 0) {
                return res.status(404).send("Laporan tidak ditemukan");
            }

            res.redirect("/admin");
        }
    );
});

module.exports = router;