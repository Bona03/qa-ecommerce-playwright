require("dotenv").config();
const express = require("express");
//const Database = require("better-sqlite3");
//const { Pool } = require("pg");

const { Pool, neonConfig } = require("@neondatabase/serverless");

neonConfig.poolQueryViaFetch = true;

const app = express();

app.use(express.json());

// Allow frontend to access backend API
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin",
        "http://localhost:3000"
    );

    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );

    next();
});

/*const db = new Database("database/ecommerce.db");
db.pragma("foreign_keys = ON");
*/

const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});


// =====================================================
// GET PRODUCTS
// =====================================================

app.get("/api/products", async(req, res) => {
    const result = await db.query("SELECT * FROM products");
    const products = result.rows;

    res.json(products);
});


// =====================================================
// GET PRODUCT BY ID
// =====================================================

app.get("/api/products/:id", async(req, res) => {

    const result = await db.query(`
        SELECT *
        FROM products
        WHERE product_id = $1
    `, [req.params.id]);

    const product = result.rows[0];

    if (!product) {
        return res.status(404).json({
            message: "Product not found"
        });
    }

    res.json(product);
});


// =====================================================
// CREATE ORDER
// =====================================================

app.post("/api/orders", async(req, res) => {

    console.log("POST /api/orders");
    console.log("Request body:", req.body);

    const {
        customer_name,
        customer_email,
        items,
        payment_method
    } = req.body;


    // =================================================
    // REQUIRED DATA VALIDATION
    // =================================================

    if (!customer_name ||
        !customer_email ||
        !items ||
        !Array.isArray(items) ||
        items.length === 0 ||
        !payment_method
    ) {

        return res.status(400).json({
            message: "Required order data is missing"
        });

    }


    // =================================================
    // PAYMENT TEST SCENARIOS
    // =================================================

    if (
        payment_method ===
        "TEST_PAYMENT_DECLINED"
    ) {

        return res.status(402).json({
            message: "Payment was declined. Please select another payment method."
        });

    }


    if (
        payment_method ===
        "TEST_PAYMENT_CANCELLED"
    ) {

        return res.status(400).json({
            message: "Payment was cancelled. Please try again."
        });

    }


    if (
        payment_method !==
        "TEST_PAYMENT_VALID"
    ) {

        return res.status(400).json({
            message: "Invalid payment method"
        });

    }


    // =================================================
    // FIND OR CREATE CUSTOMER
    // =================================================

    let customerResult = await db.query(`
    SELECT *
    FROM customers
    WHERE email = $1
`, [customer_email]);

    let customer = customerResult.rows[0];


    if (!customer) {
        const customerResult = await db.query(`
            INSERT INTO customers
            (name, email)
            VALUES ($1, $2)
            RETURNING *
            `, [customer_name, customer_email]);

        customer = customerResult.rows[0];

    }


    // =================================================
    // CHECK ALL PRODUCTS
    // =================================================

    const products = [];


    for (const item of items) {

        const productResult = await db.query(`
        SELECT *
        FROM products
        WHERE product_id = $1
        `, [item.product_id]);

        const product = productResult.rows[0];


        if (!product) {

            return res.status(404).json({
                message: `Product ${item.product_id} not found`
            });

        }


        if (!Number.isInteger(item.quantity) ||
            item.quantity <= 0
        ) {

            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });

        }


        if (
            product.stock <
            item.quantity
        ) {

            return res.status(400).json({
                message: `Insufficient stock for ${product.name}`
            });

        }


        products.push({
            product: product,
            quantity: item.quantity
        });

    }


    // =================================================
    // CALCULATE TOTAL
    // =================================================

    let subtotal = 0;


    for (const item of products) {

        subtotal +=
            item.product.price *
            item.quantity;

    }


    const shipping = 20000;

    const total =
        subtotal + shipping;


    // =================================================
    // DATABASE TRANSACTION
    // =================================================
    const createOrder = async() => {

        const client = await db.connect();

        try {
            await client.query("BEGIN");

            // ---------------------------------------------
            // CREATE ORDER
            // ---------------------------------------------

            const orderResult = await client.query(`
            INSERT INTO orders
            (
                customer_id,
                total_amount,
                status
            )
            VALUES ($1, $2, $3)
            RETURNING order_id
        `, [
                customer.customer_id,
                total,
                "PENDING"
            ]);

            const orderId = orderResult.rows[0].order_id;


            // ---------------------------------------------
            // CREATE ORDER ITEMS
            // ---------------------------------------------

            for (const item of products) {

                await client.query(`
                INSERT INTO order_items
                (
                    order_id,
                    product_id,
                    quantity,
                    price
                )
                VALUES ($1, $2, $3, $4)
            `, [
                    orderId,
                    item.product.product_id,
                    item.quantity,
                    item.product.price
                ]);


                // ---------------------------------------------
                // UPDATE STOCK
                // ---------------------------------------------

                await client.query(`
                UPDATE products
                SET stock = stock - $1
                WHERE product_id = $2
            `, [
                    item.quantity,
                    item.product.product_id
                ]);

            }


            // ---------------------------------------------
            // CREATE PAYMENT
            // ---------------------------------------------

            await client.query(`
            INSERT INTO payments
            (
                order_id,
                payment_method,
                payment_status,
                amount
            )
            VALUES ($1, $2, $3, $4)
        `, [
                orderId,
                payment_method,
                "PAID",
                total
            ]);

            await client.query("COMMIT");

            return orderId;

        } catch (error) {

            await client.query("ROLLBACK");
            throw error;

        } finally {

            client.release();

        }
    };


    const orderId = await createOrder();

    // =================================================
    // RESPONSE ITEMS
    // =================================================

    const responseItems =
        products.map(item => {

            return {
                product_id: item.product.product_id,

                product: item.product.name,

                quantity: item.quantity,

                price: item.product.price,

                item_total: item.product.price *
                    item.quantity
            };

        });


    // =================================================
    // RESPONSE
    // =================================================

    res.status(201).json({

        message: "Order created successfully",

        order_id: orderId,

        customer_id: customer.customer_id,

        customer: customer.name,

        items: responseItems,

        subtotal: subtotal,

        shipping: shipping,

        total: total,

        payment_method: payment_method,

        payment_status: "PAID",

        status: "PENDING"

    });

});


// =====================================================
// GET ORDER DETAIL
// =====================================================

app.get("/api/orders/:id", async(req, res) => {

    const orderResult = await db.query(`
    SELECT
        orders.order_id,
        customers.customer_id,
        customers.name AS customer,
        customers.email,
        orders.total_amount,
        orders.status,
        orders.created_at
    FROM orders
    JOIN customers
        ON orders.customer_id = customers.customer_id
    WHERE orders.order_id = $1
`, [req.params.id]);

    const order = orderResult.rows[0];


    if (!order) {

        return res.status(404).json({
            message: "Order not found"
        });

    }


    const itemsResult = await db.query(`
    SELECT
        products.product_id,
        products.name AS product,
        order_items.quantity,
        order_items.price,
        order_items.quantity * order_items.price AS item_total
    FROM order_items
    JOIN products
        ON order_items.product_id = products.product_id
    WHERE order_items.order_id = $1
`, [req.params.id]);

    const items = itemsResult.rows;


    const paymentResult = await db.query(`
    SELECT
        payment_method,
        payment_status,
        amount
    FROM payments
    WHERE order_id = $1
`, [req.params.id]);

    const payment = paymentResult.rows[0];


    res.json({

        order_id: order.order_id,

        customer_id: order.customer_id,

        customer: order.customer,

        email: order.email,

        items: items,

        total: order.total_amount,

        status: order.status,

        created_at: order.created_at,

        payment_method: payment ?
            payment.payment_method : null,

        payment_status: payment ?
            payment.payment_status : null

    });

});


// =====================================================
// START SERVER
// =====================================================

const PORT = process.env.PORT || 3001;

if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`API server running on port ${PORT}`);
    });
}

module.exports = app;