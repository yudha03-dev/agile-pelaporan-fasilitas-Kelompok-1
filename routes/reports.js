const express = require("express");
const db = require("../database/db");

const router = express.Router();

router.post("/", (req, res) => {
    const { user_id, judul, lokasi, deskripsi } = req.body;

    if (!user_id || !judul || !lokasi || !deskripsi) {
        return res.status(400).json({
            message: "Semua field wajib diisi"
        });
    }

    db.run(
        `
        INSERT INTO reports (user_id, judul, lokasi, deskripsi)
        VALUES (?, ?, ?, ?)
        `,
        [user_id, judul, lokasi, deskripsi],
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

router.get("/", (req,res)=>{
    db.all(
        `
        SELECT * FROM reports
        ORDER BY created_at DESC
        `,
        [],
        (err,rows)=>{
            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
});

router.get("/user/:id",(req,res)=>{
    const userId = req.params.id;

    db.all(
        `
        SELECT * FROM reports
        WHERE user_id = ?
        ORDER BY created_at DESC
        `,
        [userId],
        (err,rows)=>{
            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json(rows);
        }
    );
});

router.put("/:id",(req,res)=>{
    const { status } = req.body;

    db.run(
        `
        UPDATE reports
        SET status = ?
        WHERE id = ?
        `,
        [status, req.params.id],
        function(err){
            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            res.json({
                message:"Status berhasil diperbarui"
            });
        }
    );
});

router.delete("/:id",(req,res)=>{
    const id = req.params.id;

    db.run(
        `
        DELETE FROM reports
        WHERE id = ?
        `,
        [id],
        function(err){

            if(err){
                return res.status(500).json({
                    message: err.message
                });
            }

            if(this.changes === 0){
                return res.status(404).json({
                    message:"Laporan tidak ditemukan"
                });
            }

            res.json({
                message:"Laporan berhasil dihapus"
            });

        }
    );
});

module.exports = router;