const express = require("express");
const authRoutes = require("./routes/auth");

require("./database/db");

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("CampusFix API Berjalan");
});

app.listen(3000, () => {
    console.log("Server berjalan di port 3000");
});