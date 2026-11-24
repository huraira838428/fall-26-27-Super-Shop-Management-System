
// =====================================
// SUPERSHOP - SMART POS JAVASCRIPT
// =====================================

document.addEventListener("DOMContentLoaded", function () {

    // TAX RATE
    const TAX_RATE = 0.05;

    // GET HTML ELEMENTS
    const cartContainer = document.querySelector("[data-cart-items]");
    const cartCount = document.querySelector("[data-cart-count]");
    const subtotalElement = document.querySelector("[data-subtotal]");
    const taxElement = document.querySelector("[data-tax]");
    const totalElement = document.querySelector("[data-total]");
    const searchInput = document.querySelector("#posSearch");
    const checkoutButton = document.querySelector("[data-checkout]");
    const clearButton = document.querySelector("[data-clear-cart]");
    const paymentMethod = document.querySelector("[data-payment-method]");

    // LOAD SAVED CART
    let cart = JSON.parse(localStorage.getItem("supershopCart")) || [];


    // =====================================
    // 1. SAVE CART
    // =====================================

    function saveCart() {

        localStorage.setItem(
            "supershopCart",
            JSON.stringify(cart)
        );

    }


    // =====================================
    // 2. ADD PRODUCT TO CART
    // =====================================

    document.addEventListener("click", function (event) {

        const button = event.target.closest("[data-add-to-cart]");

        if (!button) return;

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (!name || !Number.isFinite(price) || price < 0) {
            alert("Invalid product!");
            return;
        }

        const existingProduct = cart.find(function (item) {
            return item.name === name;
        });

        if (existingProduct) {

            existingProduct.quantity++;

        } else {

            cart.push({
                name: name,
                price: price,
                quantity: 1
            });

        }

        saveCart();
        updateCart();

    });


    // =====================================
    // 3. UPDATE CART DISPLAY
    // =====================================

    function updateCart() {

        if (!cartContainer) return;

        cartContainer.innerHTML = "";

        if (cart.length === 0) {

            const emptyMessage = document.createElement("div");

            emptyMessage.className = "empty-state";

            emptyMessage.textContent =
                "Your cart is empty. Choose a product to get started.";

            cartContainer.appendChild(emptyMessage);

        }


        cart.forEach(function (item, index) {

            const row = document.createElement("div");

            row.className = "cart-item";

            const name = document.createElement("span");

            name.textContent = item.name;

            const price = document.createElement("span");

            price.textContent = "৳" + item.price.toFixed(2);

            const decreaseButton = document.createElement("button");

            decreaseButton.textContent = "-";

            decreaseButton.dataset.cartAction = "decrease";

            decreaseButton.dataset.index = index;

            const quantity = document.createElement("span");

            quantity.textContent = item.quantity;

            const increaseButton = document.createElement("button");

            increaseButton.textContent = "+";

            increaseButton.dataset.cartAction = "increase";

            increaseButton.dataset.index = index;

            const removeButton = document.createElement("button");

            removeButton.textContent = "Remove";

            removeButton.dataset.cartAction = "remove";

            removeButton.dataset.index = index;

            row.append(
                name,
                price,
                decreaseButton,
                quantity,
                increaseButton,
                removeButton
            );

            cartContainer.appendChild(row);

        });


        // UPDATE ITEM COUNT
        if (cartCount) {

            const count = cart.reduce(function (sum, item) {
                return sum + item.quantity;
            }, 0);

            cartCount.textContent = count;

        }


        calculateTotal();

    }


    // =====================================
    // 4. INCREASE / DECREASE / REMOVE
    // =====================================

    document.addEventListener("click", function (event) {

        const button = event.target.closest("[data-cart-action]");

        if (!button) return;

        const index = Number(button.dataset.index);

        const action = button.dataset.cartAction;

        if (!Number.isInteger(index) || !cart[index]) return;


        if (action === "increase") {

            cart[index].quantity++;

        }

        else if (action === "decrease") {

            cart[index].quantity--;

            if (cart[index].quantity <= 0) {

                cart.splice(index, 1);

            }

        }

        else if (action === "remove") {

            cart.splice(index, 1);

        }


        saveCart();

        updateCart();

    });


    // =====================================
    // 5. CALCULATE TOTAL
    // =====================================

    function calculateTotal() {

        let subtotal = 0;

        cart.forEach(function (item) {

            subtotal += item.price * item.quantity;

        });

        const tax = subtotal * TAX_RATE;

        const total = subtotal + tax;


        if (subtotalElement) {

            subtotalElement.textContent =
                "৳" + subtotal.toFixed(2);

        }

        if (taxElement) {

            taxElement.textContent =
                "৳" + tax.toFixed(2);

        }

        if (totalElement) {

            totalElement.textContent =
                "৳" + total.toFixed(2);

        }

    }


    // =====================================
    // 6. PRODUCT SEARCH
    // =====================================

    if (searchInput) {

        searchInput.addEventListener("input", function () {

            const searchText = searchInput.value.toLowerCase();

            document.querySelectorAll("[data-search-item]").forEach(
                function (product) {

                    const productName =
                        product.textContent.toLowerCase();

                    if (productName.includes(searchText)) {

                        product.classList.remove("hidden");

                    } else {

                        product.classList.add("hidden");

                    }

                }
            );

        });

    }


    // =====================================
    // 7. CLEAR CART
    // =====================================

    if (clearButton) {

        clearButton.addEventListener("click", function () {

            cart = [];

            saveCart();

            updateCart();

        });

    }


    // =====================================
    // 8. CHECKOUT
    // =====================================

    if (checkoutButton) {

        checkoutButton.addEventListener("click", function () {

            if (cart.length === 0) {

                alert("Your cart is empty!");

                return;

            }

            const method = paymentMethod
                ? paymentMethod.value
                : "Cash";

            let subtotal = 0;

            cart.forEach(function (item) {

                subtotal += item.price * item.quantity;

            });

            const tax = subtotal * TAX_RATE;

            const total = subtotal + tax;


            alert(
                "ORDER SUCCESSFUL!\n\n" +
                "Payment: " + method + "\n" +
                "Subtotal: ৳" + subtotal.toFixed(2) + "\n" +
                "Tax: ৳" + tax.toFixed(2) + "\n" +
                "Total: ৳" + total.toFixed(2)
            );


            // CLEAR CART AFTER DEMO CHECKOUT
            cart = [];

            saveCart();

            updateCart();

        });

    }


    // =====================================
    // 9. INITIALIZE
    // =====================================

    updateCart();

    console.log("SuperShop Smart POS Connected!");

});
