const express = require("express");

const app = express();

app.use(express.json());
app.use(express.static("public"));

require("./database/db");

const authRoutes = require("./routes/auth");
const reportRoutes = require("./routes/reports");

app.use("/api/auth", authRoutes);
app.use("/api/reports", reportRoutes);
const db = require("./database/db");

db.all("SELECT id, nama, email, role FROM users", [], (err, rows) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("ISI USERS:", rows);
    }
});
app.get("/", (req, res) => {
    res.send("CampusFix API Berjalan");
});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});