const API_URL = "https://qa-ecommerce-playwright.vercel.app";

const orderData = JSON.parse(
    localStorage.getItem("orderData")
);

async function loadOrder() {
    if (!orderData || !orderData.orderId) {
        document.getElementById("order-confirmation").innerHTML = `
            <div class="confirmation-card">
                <p>Order data not found.</p>
                <a href="index.html">← Back to Shop</a>
            </div>
        `;
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/api/orders/${orderData.orderId}`
        );

        if (!response.ok) {
            throw new Error("Failed to load order");
        }

        const order = await response.json();

        console.log("Order from backend:", order);

        renderOrder(order);

    } catch (error) {
        console.error("Order error:", error);

        document.getElementById("success-message").textContent =
            "Unable to load order information.";
    }
}

function renderOrder(order) {
    const confirmationSection =
        document.getElementById("order-confirmation");

    const itemsHTML = order.items.map(item => {
        return `
            <div class="confirmation-product">
                <div class="confirmation-product-icon">
                    🛒
                </div>

                <div class="confirmation-product-info">
                    <h3>${item.product}</h3>

                    <p>
                        Rp ${item.price.toLocaleString("id-ID")}
                        × ${item.quantity}
                    </p>
                </div>

                <strong class="confirmation-product-total">
                    Rp ${item.item_total.toLocaleString("id-ID")}
                </strong>
            </div>
        `;
    }).join("");

    const subtotal = order.items.reduce(
        (sum, item) => sum + item.item_total,
        0
    );

    const shipping = 20000;

    confirmationSection.innerHTML = `
        <div class="confirmation-card">

            <div class="confirmation-header">
                <span class="confirmation-check">✓</span>

                <p class="confirmation-label">
                    ORDER SUCCESSFUL
                </p>

                <h2>Order Confirmed!</h2>

                <p class="confirmation-message">
                    Your order has been successfully placed.
                </p>
            </div>

            <div class="confirmation-info">

                <div>
                    <span>Order ID</span>
                    <strong>${order.order_id}</strong>
                </div>

                <div>
                    <span>Customer</span>
                    <strong>${order.customer}</strong>
                </div>

                <div>
                    <span>Email</span>
                    <strong>${order.email}</strong>
                </div>

            </div>

            <div class="confirmation-section">

                <div class="confirmation-section-heading">
                    <h3>Order Items</h3>
                    <p>Your purchased products.</p>
                </div>

                <div class="confirmation-products">
                    ${itemsHTML}
                </div>

            </div>

            <div class="confirmation-summary">

                <div>
                    <span>Subtotal</span>
                    <strong>
                        Rp ${subtotal.toLocaleString("id-ID")}
                    </strong>
                </div>

                <div>
                    <span>Shipping</span>
                    <strong>
                        Rp ${shipping.toLocaleString("id-ID")}
                    </strong>
                </div>

                <div class="confirmation-total">
                    <span>Total</span>
                    <strong>
                        Rp ${order.total.toLocaleString("id-ID")}
                    </strong>
                </div>

            </div>

            <div class="confirmation-payment">

                <span>Payment Status</span>

                <strong class="payment-paid">
                    ${order.payment_status}
                </strong>

            </div>

            <a
                href="index.html"
                class="back-to-shop"
            >
                ← Back to Shop
            </a>

        </div>
    `;
}

loadOrder();
