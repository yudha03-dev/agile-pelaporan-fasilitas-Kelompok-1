const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./campusfix.db", (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log("Database terhubung");
    }
});

db.run(`
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nama TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'pelapor'
)
`);

module.exports = db;