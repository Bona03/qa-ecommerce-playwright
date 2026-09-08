const API_URL = "http://localhost:3001";

let cart = [];

// =====================================================
// LOAD CART FROM LOCAL STORAGE
// =====================================================

function loadCart() {
    const savedCart = localStorage.getItem("cartData");

    if (!savedCart) {
        cart = [];
        return;
    }

    cart = JSON.parse(savedCart);

    console.log("Cart from localStorage:", cart);
}


// =====================================================
// RENDER ORDER SUMMARY
// =====================================================

function renderOrderSummary() {

    const orderSummary =
        document.getElementById("order-summary");

    if (!orderSummary) {
        return;
    }

    if (cart.length === 0) {

        orderSummary.innerHTML = `
            <div class="card-heading">
                <span class="step-number">3</span>
                <div>
                    <h2>Order Summary</h2>
                    <p>No products selected.</p>
                </div>
            </div>
        `;

        return;
    }


    // Hitung subtotal semua produk
    const subtotal = cart.reduce(
        (sum, item) => {
            return sum + (item.price * item.quantity);
        },
        0
    );


    // Shipping hanya sekali per order
    const shipping = 20000;

    const total = subtotal + shipping;


    // Buat daftar produk
    const productHTML = cart.map(item => {

        const itemTotal =
            item.price * item.quantity;

        return `
            <div class="summary-product">

                <div class="summary-product-icon">
                    🛒
                </div>

                <div>
                    <h3>${item.name}</h3>

                    <p>
                        Rp ${item.price.toLocaleString("id-ID")}
                        × ${item.quantity}
                        =
                        Rp ${itemTotal.toLocaleString("id-ID")}
                    </p>

                </div>

            </div>
        `;

    }).join("");


    orderSummary.innerHTML = `

        <div class="card-heading">

            <span class="step-number">3</span>

            <div>
                <h2>Order Summary</h2>
                <p>Your selected products.</p>
            </div>

        </div>


        <div class="summary-products">

            ${productHTML}

        </div>


        <div class="summary-details">

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

        </div>


        <div class="summary-total">

            <span>Total</span>

            <strong>
                Rp ${total.toLocaleString("id-ID")}
            </strong>

        </div>

    `;
}


// =====================================================
// PLACE ORDER
// =====================================================

const placeOrderButton =
    document.getElementById("place-order");


placeOrderButton.addEventListener(
    "click",
    async function() {

        const fullName =
            document.getElementById("full-name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const address =
            document.getElementById("address").value.trim();

        const city =
            document.getElementById("city").value.trim();

        const postalCode =
            document.getElementById("postal-code").value.trim();

        const paymentMessage =
            document.getElementById("payment-message");

        const paymentMethod =
            document.querySelector(
                'input[name="payment-method"]:checked'
            );


        // =================================================
        // REQUIRED FIELD VALIDATION
        // =================================================

        if (!fullName) {
            alert("Full Name is required.");
            return;
        }

        if (!email) {
            alert("Email is required.");
            return;
        }

        if (!phone) {
            alert("Phone Number is required.");
            return;
        }

        if (!address) {
            alert("Address is required.");
            return;
        }

        if (!city) {
            alert("City is required.");
            return;
        }

        if (!postalCode) {
            alert("Postal Code is required.");
            return;
        }

        if (!paymentMethod) {
            alert("Payment Method is required.");
            return;
        }


        // =================================================
        // FORMAT VALIDATION
        // =================================================

        if (!email.includes("@")) {
            alert("Please enter a valid email.");
            return;
        }

        if (!/^\d+$/.test(phone)) {
            alert("Please enter a valid phone number.");
            return;
        }

        if (!/^\d+$/.test(postalCode)) {
            alert("Please enter a valid postal code.");
            return;
        }


        // =================================================
        // PAYMENT TEST SCENARIOS
        // =================================================

        if (
            paymentMethod.value ===
            "TEST_PAYMENT_DECLINED"
        ) {

            paymentMessage.textContent =
                "Payment was declined. Please select another payment method and try again.";

            return;
        }


        if (
            paymentMethod.value ===
            "TEST_PAYMENT_CANCELLED"
        ) {

            paymentMessage.textContent =
                "Payment was cancelled. Please try again.";

            return;
        }


        // =================================================
        // CHECK CART
        // =================================================

        if (cart.length === 0) {

            paymentMessage.textContent =
                "Your cart is empty.";

            return;
        }


        try {

            paymentMessage.textContent =
                "Processing order...";


            // =================================================
            // SEND ALL CART ITEMS TO BACKEND
            // =================================================

            const response = await fetch(
                `${API_URL}/api/orders`, {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        customer_name: fullName,

                        customer_email: email,

                        items: cart.map(item => ({
                            product_id: item.productId,
                            quantity: item.quantity
                        })),

                        payment_method: paymentMethod.value

                    })
                }
            );


            const result =
                await response.json();


            console.log(
                "Backend response:",
                result
            );


            if (!response.ok) {

                paymentMessage.textContent =
                    result.message ||
                    "Failed to create order.";

                return;
            }


            // =================================================
            // SAVE ORDER DATA
            // =================================================

            const orderData = {

                orderId: result.order_id,

                fullName: fullName,

                email: email,

                phone: phone,

                address: address,

                city: city,

                postalCode: postalCode,

                items: result.items,

                total: `Rp ${result.total.toLocaleString("id-ID")}`,

                paymentStatus: result.payment_status

            };


            localStorage.setItem(
                "orderData",
                JSON.stringify(orderData)
            );


            // Cart sudah selesai digunakan
            localStorage.removeItem("cartData");


            paymentMessage.textContent =
                "Payment successful.";


            window.location.href =
                "confirmation.html";


        } catch (error) {

            console.error(
                "Order error:",
                error
            );

            paymentMessage.textContent =
                "Unable to connect to backend server.";

        }

    }
);


// =====================================================
// START CHECKOUT
// =====================================================

loadCart();

renderOrderSummary();