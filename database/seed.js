const Database = require("better-sqlite3");

const db = new Database("database/ecommerce.db");

db.pragma("foreign_keys = ON");

// ===============================
// CUSTOMERS
// ===============================

const insertCustomer = db.prepare(`
    INSERT OR IGNORE INTO customers
    (name, email)
    VALUES (?, ?)
`);

insertCustomer.run("Mian", "mian@email.com");


// ===============================
// PRODUCTS
// ===============================

const insertProduct = db.prepare(`
    INSERT OR IGNORE INTO products
    (name, price, stock)
    VALUES (?, ?, ?)
`);

insertProduct.run(
    "Wireless Headphones",
    500000,
    15
);

insertProduct.run(
    "Mechanical Keyboard",
    750000,
    10
);

insertProduct.run(
    "Wireless Mouse",
    250000,
    20
);


console.log("Dummy data inserted successfully.");

db.close();