const productList = document.getElementById("product-list");
const cartItem = document.getElementById("cart-item");
const checkoutButton = document.getElementById("checkout-button");

const API_URL = "https://molasses-thin-bat.abasthan.app"

let products = [];
let cart = [];


// =====================================================
// LOAD PRODUCTS FROM BACKEND
// =====================================================

async function loadProducts() {

    try {

        const response = await fetch(
            `${API_URL}/api/products`
        );

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        products = await response.json();

        console.log("Products from backend:", products);

        renderProducts();

    } catch (error) {

        console.error("Product error:", error);

        productList.innerHTML = `
            <p>
                Unable to load products from server.
            </p>
        `;
    }
}


// =====================================================
// DISPLAY PRODUCTS
// =====================================================

function renderProducts() {

    productList.innerHTML = "";

    products.forEach(product => {

        const productCard =
            document.createElement("div");

        productCard.className = "product-card";

        const outOfStock = product.stock <= 0;

        productCard.innerHTML = `
            <h3>${product.name}</h3>

            <p>
                Price:
                Rp ${product.price.toLocaleString("id-ID")}
            </p>

            <p>
                Stock:
                ${product.stock}
            </p>

            <button
                type="button"
                class="add-to-cart"
                data-product-id="${product.product_id}"
                ${outOfStock ? "disabled" : ""}>
                ${outOfStock ? "Out of Stock" : "Add to Cart"}
            </button>
        `;

        productList.appendChild(productCard);
    });
}


// =====================================================
// ADD PRODUCT TO CART
// =====================================================

productList.addEventListener(
    "click",
    function(event) {

        if (!event.target.classList.contains(
                "add-to-cart"
            )) {
            return;
        }

        const productId = Number(
            event.target.dataset.productId
        );

        const product = products.find(
            item =>
            item.product_id === productId
        );

        if (!product) {
            return;
        }

        // Cari apakah produk sudah ada di cart
        const existingItem = cart.find(
            item =>
            item.productId === product.product_id
        );


        // Jika sudah ada → tambah quantity
        if (existingItem) {

            if (
                existingItem.quantity >=
                product.stock
            ) {

                alert(
                    `Maximum quantity for ${product.name} is ${product.stock}.`
                );

                return;
            }

            existingItem.quantity += 1;

        } else {

            // Jika belum ada → masukkan ke cart
            cart.push({
                productId: product.product_id,
                name: product.name,
                price: product.price,
                stock: product.stock,
                quantity: 1
            });
        }


        console.log("Current cart:", cart);

        renderCart();
    }
);


// =====================================================
// RENDER CART
// =====================================================

function renderCart() {

    if (cart.length === 0) {

        cartItem.innerHTML =
            "No items in cart.";

        checkoutButton.disabled = true;

        return;
    }


    cartItem.innerHTML = "";


    cart.forEach(item => {

        const itemContainer =
            document.createElement("div");

        itemContainer.className =
            "cart-product";


        const itemTotal =
            item.price * item.quantity;


        itemContainer.innerHTML = `
            <div>
                <strong>${item.name}</strong>

                <p>
                    Rp ${item.price.toLocaleString("id-ID")}
                    × ${item.quantity}
                    =
                    Rp ${itemTotal.toLocaleString("id-ID")}
                </p>
            </div>

            <div class="cart-controls">

                <button
                    type="button"
                    class="quantity-minus"
                    data-product-id="${item.productId}">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    type="button"
                    class="quantity-plus"
                    data-product-id="${item.productId}">
                    +
                </button>

                <button
                    type="button"
                    class="remove-item"
                    data-product-id="${item.productId}">
                    Remove
                </button>

            </div>
        `;


        cartItem.appendChild(itemContainer);
    });


    // Hitung total semua produk
    const total = cart.reduce(
        (sum, item) =>
        sum + (item.price * item.quantity),
        0
    );


    const totalElement =
        document.createElement("p");

    totalElement.innerHTML = `
        <strong>
            Cart Total:
            Rp ${total.toLocaleString("id-ID")}
        </strong>
    `;


    cartItem.appendChild(totalElement);

    checkoutButton.disabled = false;
}


// =====================================================
// CART CONTROLS
// =====================================================

cartItem.addEventListener(
    "click",
    function(event) {

        const productId = Number(
            event.target.dataset.productId
        );


        // ---------------------------------------------
        // PLUS
        // ---------------------------------------------

        if (
            event.target.classList.contains(
                "quantity-plus"
            )
        ) {

            const item = cart.find(
                item =>
                item.productId === productId
            );

            if (!item) {
                return;
            }


            if (
                item.quantity >= item.stock
            ) {

                alert(
                    `Maximum quantity for ${item.name} is ${item.stock}.`
                );

                return;
            }


            item.quantity += 1;

            renderCart();

            return;
        }


        // ---------------------------------------------
        // MINUS
        // ---------------------------------------------

        if (
            event.target.classList.contains(
                "quantity-minus"
            )
        ) {

            const item = cart.find(
                item =>
                item.productId === productId
            );

            if (!item) {
                return;
            }


            item.quantity -= 1;


            // Quantity 0 → hapus produk
            if (item.quantity <= 0) {

                cart = cart.filter(
                    item =>
                    item.productId !== productId
                );
            }


            renderCart();

            return;
        }


        // ---------------------------------------------
        // REMOVE
        // ---------------------------------------------

        if (
            event.target.classList.contains(
                "remove-item"
            )
        ) {

            cart = cart.filter(
                item =>
                item.productId !== productId
            );

            renderCart();
        }
    }
);


// =====================================================
// GO TO CHECKOUT
// =====================================================

checkoutButton.addEventListener(
    "click",
    function() {

        if (cart.length === 0) {
            return;
        }


        // Simpan seluruh isi cart
        localStorage.setItem(
            "cartData",
            JSON.stringify(cart)
        );


        console.log(
            "Cart saved:",
            cart
        );


        window.location.href =
            "checkout.html";
    }
);


// =====================================================
// START APPLICATION
// =====================================================

loadProducts();