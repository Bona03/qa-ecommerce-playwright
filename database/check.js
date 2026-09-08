const Database = require("better-sqlite3");

const db = new Database("database/ecommerce.db");

console.log("CUSTOMERS:");
console.table(
    db.prepare("SELECT * FROM customers").all()
);

console.log("PRODUCTS:");
console.table(
    db.prepare("SELECT * FROM products").all()
);

console.log("ORDERS:");
console.table(
    db.prepare("SELECT * FROM orders").all()
);

console.log("ORDER ITEMS:");
console.table(
    db.prepare("SELECT * FROM order_items").all()
);

console.log("PAYMENTS:");
console.table(
    db.prepare("SELECT * FROM payments").all()
);

db.close();