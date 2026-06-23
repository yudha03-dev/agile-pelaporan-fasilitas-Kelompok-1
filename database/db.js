const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./campusfix.db", (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Database terhubung");
    }
});

// USERS
db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'pelapor',
    kategori TEXT DEFAULT 'mahasiswa'
)
`);

// REPORTS
db.run(`
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    judul TEXT NOT NULL,
    kategori TEXT NOT NULL,
    lokasi TEXT NOT NULL,
    deskripsi TEXT NOT NULL,
    urgensi TEXT NOT NULL,
    status TEXT DEFAULT 'Dilaporkan',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

module.exports = db;