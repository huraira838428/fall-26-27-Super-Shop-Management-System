
document.addEventListener("DOMContentLoaded", function () {

    // =====================================
    // 1. SMART POS - PRODUCT SEARCH
    // =====================================

    const posSearch = document.getElementById("posSearch");
    const posProducts = document.getElementById("posProducts");

    if (posSearch && posProducts) {
        posSearch.addEventListener("input", function () {
            const searchValue = posSearch.value.toLowerCase();

            const products = posProducts.querySelectorAll(".product-tile");

            products.forEach(function (product) {
                const productName = product.innerText.toLowerCase();

                product.classList.toggle(
                    "hidden",
                    !productName.includes(searchValue)
                );
            });
        });
    }


    // =====================================
    // 2. SMART POS - SHOPPING CART
    // =====================================

    const cartLines = document.getElementById("cartLines");
    const cartSubtotal = document.getElementById("cartSubtotal");
    const cartTotal = document.getElementById("cartTotal");
    const checkoutButton = document.getElementById("checkoutButton");

    let cart = [];

    function updateCart() {

        if (!cartLines) return;

        cartLines.innerHTML = "";

        if (cart.length === 0) {
            cartLines.innerHTML = `
                <div class="empty-state">
                    Your cart is empty.<br>
                    Choose a product to get started.
                </div>
            `;
        }

        let subtotal = 0;

        cart.forEach(function (item, index) {

            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const cartItem = document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `
                <div>
                    <strong>${item.name}</strong>
                    <p>৳${item.price.toFixed(2)} each</p>
                </div>

                <div class="cart-controls">
                    <button type="button" class="quantity-btn decrease"
                        data-index="${index}">−</button>

                    <span>${item.quantity}</span>

                    <button type="button" class="quantity-btn increase"
                        data-index="${index}">+</button>

                    <strong>৳${itemTotal.toFixed(2)}</strong>

                    <button type="button" class="remove-item"
                        data-index="${index}">×</button>
                </div>
            `;

            cartLines.appendChild(cartItem);
        });

        if (cartSubtotal) {
            cartSubtotal.textContent = "৳" + subtotal.toFixed(2);
        }

        if (cartTotal) {
            cartTotal.textContent = "৳" + subtotal.toFixed(2);
        }
    }


    // Add product to cart

    if (posProducts && cartLines) {

        posProducts.addEventListener("click", function (event) {

            const product = event.target.closest(".product-tile");

            if (!product) return;

            const name = product.dataset.productName;
            const price = Number(product.dataset.productPrice);

            if (!name || !Number.isFinite(price)) return;

            const existingItem = cart.find(function (item) {
                return item.name === name;
            });

            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1
                });
            }

            updateCart();
        });
    }


    // Increase, decrease and remove cart products

    if (cartLines) {

        cartLines.addEventListener("click", function (event) {

            const index = Number(event.target.dataset.index);

            if (!Number.isInteger(index) || !cart[index]) return;

            if (event.target.classList.contains("increase")) {
                cart[index].quantity++;
            }

            else if (event.target.classList.contains("decrease")) {
                cart[index].quantity--;

                if (cart[index].quantity <= 0) {
                    cart.splice(index, 1);
                }
            }

            else if (event.target.classList.contains("remove-item")) {
                cart.splice(index, 1);
            }

            else {
                return;
            }

            updateCart();
        });
    }


    // Demo checkout

    if (checkoutButton) {

        checkoutButton.addEventListener("click", function () {

            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            let subtotal = 0;
            let receipt = "SUPERSHOP - DEMO RECEIPT\n";
            receipt += "-----------------------------\n";

            cart.forEach(function (item) {

                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;

                receipt += item.name + "\n";
                receipt += item.quantity + " x ৳" +
                    item.price.toFixed(2) + " = ৳" +
                    itemTotal.toFixed(2) + "\n";
            });

            receipt += "-----------------------------\n";
            receipt += "Total: ৳" + subtotal.toFixed(2);
            receipt += "\n\nDemo transaction only.";

            alert(receipt);

            cart = [];
            updateCart();
        });
    }


    // =====================================
    // 3. PRODUCT WISHLIST - SEARCH
    // =====================================

    const wishlistSearch = document.getElementById("wishlistSearch");
    const wishlistGrid = document.getElementById("wishlistGrid");

    if (wishlistSearch && wishlistGrid) {

        wishlistSearch.addEventListener("input", function () {

            const searchValue = wishlistSearch.value.toLowerCase();

            const products = wishlistGrid.querySelectorAll(".feature-card");

            products.forEach(function (product) {

                product.classList.toggle(
                    "hidden",
                    !product.innerText.toLowerCase().includes(searchValue)
                );
            });
        });
    }


    // =====================================
    // 4. PRODUCT WISHLIST - SAVE / REMOVE
    // =====================================

    let wishlist = [];

    try {
        wishlist = JSON.parse(
            localStorage.getItem("superShopWishlist")
        ) || [];
    } catch (error) {
        wishlist = [];
    }

    function saveWishlist() {
        localStorage.setItem(
            "superShopWishlist",
            JSON.stringify(wishlist)
        );
    }

    if (wishlistGrid) {

        const wishlistButtons = wishlistGrid.querySelectorAll("[data-wishlist]");

        wishlistButtons.forEach(function (button) {

            const card = button.closest(".feature-card");
            if (!card) return;

            const productName = card.querySelector("h3")?.innerText.trim();

            if (wishlist.includes(productName)) {
                button.textContent = "♥ Remove from wishlist";
            }
        });

        wishlistGrid.addEventListener("click", function (event) {

            const button = event.target.closest("[data-wishlist]");

            if (!button) return;

            const card = button.closest(".feature-card");
            if (!card) return;

            const productName = card.querySelector("h3")?.innerText.trim();

            if (!productName) return;

            if (wishlist.includes(productName)) {

                wishlist = wishlist.filter(function (name) {
                    return name !== productName;
                });

                button.textContent = "♡ Add to wishlist";

                alert(productName + " removed from wishlist.");

            } else {

                wishlist.push(productName);

                button.textContent = "♥ Remove from wishlist";

                alert(productName + " added to wishlist!");
            }

            saveWishlist();
        });
    }


    // =====================================
    // 5. LOYALTY REWARDS - CUSTOMER SEARCH
    // =====================================

    const customerSearch =
        document.getElementById("customerSearch") ||
        document.querySelector('[data-filter-table="#loyaltyTable"]');

    const loyaltyTable = document.getElementById("loyaltyTable");

    if (customerSearch && loyaltyTable) {

        customerSearch.addEventListener("input", function () {

            const searchValue = customerSearch.value.toLowerCase();

            const rows = loyaltyTable.querySelectorAll("tbody tr");

            rows.forEach(function (row) {

                const customerInfo = row.innerText.toLowerCase();

                row.classList.toggle(
                    "hidden",
                    !customerInfo.includes(searchValue)
                );
            });
        });
    }


    // =====================================
    // 6. POS CUSTOMER PAGE - NAVIGATION
    // =====================================

    const featureLinks = document.querySelectorAll(
        ".module-grid .feature-card .text-link"
    );

    featureLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            // Normal HTML navigation will work.
            // This event is kept for future enhancements.

        });
    });

});

/* =====================================
   ADDITIONAL JAVASCRIPT
   Keep previous JavaScript unchanged
===================================== */

document.addEventListener("DOMContentLoaded", function () {

    // Dashboard Product Management

    const productInputs = document.querySelectorAll("input");

    const addProductButton = Array.from(
        document.querySelectorAll("button")
    ).find(function (button) {
        return button.innerText.trim().toLowerCase() === "add product";
    });

    if (addProductButton && productInputs.length >= 2) {

        addProductButton.addEventListener("click", function () {

            const productName = productInputs[0].value.trim();
            const productPrice = Number(productInputs[1].value);

            if (productName === "" || productInputs[1].value === "") {
                alert("Please enter product name and price.");
                return;
            }

            if (!Number.isFinite(productPrice) || productPrice <= 0) {
                alert("Please enter a valid price.");
                return;
            }

            const productList = document.getElementById("productList");

            if (!productList) {
                alert("Product List section is not available.");
                return;
            }

            const newProduct = document.createElement("div");

            newProduct.className = "panel";

            const name = document.createElement("strong");
            name.textContent = productName;

            const price = document.createElement("p");
            price.textContent = "Price: ৳" + productPrice.toFixed(2);

            newProduct.appendChild(name);
            newProduct.appendChild(price);

            productList.appendChild(newProduct);

            productInputs[0].value = "";
            productInputs[1].value = "";

            alert("Product added successfully!");
        });
    }

});
