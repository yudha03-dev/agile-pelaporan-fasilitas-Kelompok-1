const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Database
const db = require("./database/db");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static Files
app.use(express.static("public"));

// Routes
const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);

// Debug users
db.all(
    "SELECT id, nama, email, role FROM users",
    [],
    (err, rows) => {
        if (err) {
            console.log(err.message);
        } else {
            console.log("ISI USERS:", rows);
        }
    }
);

// Halaman utama
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Halaman register
app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});