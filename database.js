const Database = require("better-sqlite3");

// ✅ Initialize database
const db = new Database("transactions.db");

// ✅ Create table (if it doesn't exist)
db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        eventCode TEXT,
        pspReference TEXT UNIQUE,
        merchantReference TEXT,
        amount INTEGER,
        currency TEXT,
        paymentMethod TEXT,
        success BOOLEAN,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

module.exports = db;
