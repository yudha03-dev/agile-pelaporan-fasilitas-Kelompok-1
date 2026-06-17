const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../database/db");

const router = express.Router();

router.post("/register", async (req, res) => {

    const { nama, email, password, role } = req.body;

    if (!nama || !email || !password || !role) {
        return res.status(400).json({
            message: "Semua field wajib diisi"
        });
    }

    try {

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
            "INSERT INTO users (nama,email,password,role) VALUES (?,?,?,?)",
            [nama, email, hashedPassword, role],
            function (err) {

                if (err) {
                    return res.status(400).json({
                        message: err.message
                    });
                }

                res.json({
                    message: "Registrasi berhasil"
                });

            }
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

router.post("/login", (req, res) => {

    const { email, password } = req.body;

    db.get(
        "SELECT * FROM users WHERE email = ?",
        [email],
        async (err, user) => {

            if (err) {
                return res.status(500).json({
                    message: err.message
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "User tidak ditemukan"
                });
            }

            const cocok = await bcrypt.compare(
                password,
                user.password
            );

            if (!cocok) {
                return res.status(401).json({
                    message: "Password salah"
                });
            }

            res.json({
                message: "Login berhasil",
                user: {
                    id: user.id,
                    nama: user.nama,
                    email: user.email,
                    role: user.role
                }
            });

        }
    );

});

module.exports = router;