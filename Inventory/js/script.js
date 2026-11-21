

const PRODUCT_STORAGE_KEY = "superShopProducts";
const RESTOCK_STORAGE_KEY = "superShopRestockHistory";
const LOW_STOCK_LIMIT = 10;



const defaultProducts = [
  { id: "P001", name: "Rice", category: "Grocery", price: 75, quantity: 50 },
  { id: "P002", name: "Cooking Oil", category: "Grocery", price: 180, quantity: 8 },
  { id: "P003", name: "Milk", category: "Dairy", price: 90, quantity: 0 },
  { id: "P004", name: "Sugar", category: "Grocery", price: 120, quantity: 25 },
  { id: "P005", name: "Eggs", category: "Dairy", price: 12, quantity: 5 }
];




function loadProducts() {
  const savedProducts = localStorage.getItem(PRODUCT_STORAGE_KEY);

  if (savedProducts === null) {
    saveProducts(defaultProducts);
    return defaultProducts.slice();
  }

  try {
    return JSON.parse(savedProducts);
  } catch (error) {
    saveProducts(defaultProducts);
    return defaultProducts.slice();
  }
}

function saveProducts(products) {
  localStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(products));
}

function loadRestockHistory() {
  const savedHistory = localStorage.getItem(RESTOCK_STORAGE_KEY);

  if (savedHistory === null) {
    return [];
  }

  try {
    return JSON.parse(savedHistory);
  } catch (error) {
    return [];
  }
}

function saveRestockHistory(history) {
  localStorage.setItem(RESTOCK_STORAGE_KEY, JSON.stringify(history));
}



function getStockStatus(quantity) {
  if (quantity === 0) {
    return "Out of Stock";
  } else if (quantity <= LOW_STOCK_LIMIT) {
    return "Low Stock";
  } else {
    return "In Stock";
  }
}

function getStatusClass(quantity) {
  if (quantity === 0) {
    return "status-out";
  } else if (quantity <= LOW_STOCK_LIMIT) {
    return "status-low";
  } else {
    return "status-in";
  }
}




function showMessage(elementId, message, type) {
  const messageElement = document.getElementById(elementId);

  if (messageElement !== null) {
    messageElement.textContent = message;
    messageElement.className = "form-message " + type;
  }
}



function generateReport() {
  const products = loadProducts();

  let totalProducts = 0;
  let totalStock = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  for (const product of products) {
    totalProducts++;
    totalStock = totalStock + Number(product.quantity);

    if (Number(product.quantity) === 0) {
      outOfStockCount++;
    } else if (Number(product.quantity) <= LOW_STOCK_LIMIT) {
      lowStockCount++;
    }
  }

  const totalProductsElement = document.getElementById("totalProducts");
  const totalStockElement = document.getElementById("totalStock");
  const lowStockElement = document.getElementById("lowStock");
  const outOfStockElement = document.getElementById("outOfStock");

  if (totalProductsElement !== null) totalProductsElement.textContent = totalProducts;
  if (totalStockElement !== null) totalStockElement.textContent = totalStock;
  if (lowStockElement !== null) lowStockElement.textContent = lowStockCount;
  if (outOfStockElement !== null) outOfStockElement.textContent = outOfStockCount;
}


/

function displayRecentProducts() {
  const tableBody = document.getElementById("recentProductsTable");

  if (tableBody === null) return;

  const products = loadProducts();
  tableBody.innerHTML = "";

  for (const product of products) {
    const row = document.createElement("tr");
    const status = getStockStatus(Number(product.quantity));

    row.innerHTML = `
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>${Number(product.price).toFixed(2)}</td>
      <td>${product.quantity}</td>
      <td><span class="status ${getStatusClass(Number(product.quantity))}">${status}</span></td>
    `;

    tableBody.appendChild(row);
  }

  if (products.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">No products found.</td></tr>';
  }
}




function displayProducts(searchText = "") {
  const tableBody = document.getElementById("productTableBody");

  if (tableBody === null) return;

  const products = loadProducts();
  const searchValue = searchText.toLowerCase().trim();
  tableBody.innerHTML = "";

  let displayedCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const searchableText = (product.id + " " + product.name + " " + product.category).toLowerCase();

    if (searchableText.includes(searchValue)) {
      const row = document.createElement("tr");
      const status = getStockStatus(Number(product.quantity));

      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${Number(product.price).toFixed(2)}</td>
        <td>${product.quantity}</td>
        <td><span class="status ${getStatusClass(Number(product.quantity))}">${status}</span></td>
        <td>
          <div class="table-action">
            <button type="button" class="btn btn-edit btn-small" onclick="editProduct(${i})">Edit</button>
            <button type="button" class="btn btn-delete btn-small" onclick="deleteProduct(${i})">Delete</button>
          </div>
        </td>
      `;

      tableBody.appendChild(row);
      displayedCount++;
    }
  }

  if (displayedCount === 0) {
    tableBody.innerHTML = '<tr><td colspan="7">No matching products found.</td></tr>';
  }

  const countElement = document.getElementById("productCount");
  if (countElement !== null) {
    countElement.textContent = "Showing " + displayedCount + " product(s).";
  }
}

function resetProductForm() {
  const form = document.getElementById("productForm");

  if (form !== null) {
    form.reset();
  }

  editProductIndex = -1;

  const title = document.getElementById("productFormTitle");
  const button = document.getElementById("saveProductButton");

  if (title !== null) title.textContent = "Add New Product";
  if (button !== null) button.textContent = "Add Product";

  showMessage("productFormMessage", "", "success");
}

function editProduct(index) {
  const products = loadProducts();
  const product = products[index];

  if (product === undefined) return;

  document.getElementById("productId").value = product.id;
  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productQuantity").value = product.quantity;

  editProductIndex = index;

  document.getElementById("productFormTitle").textContent = "Update Product";
  document.getElementById("saveProductButton").textContent = "Update Product";

  window.scrollTo(0, 0);
}

function deleteProduct(index) {
  const products = loadProducts();

  if (products[index] === undefined) return;

  const confirmed = confirm("Are you sure you want to delete this product?");

  if (confirmed) {
    products.splice(index, 1);
    saveProducts(products);
    displayProducts(document.getElementById("productSearch").value);
  }
}

function saveProduct(event) {
  event.preventDefault();

  const products = loadProducts();

  const id = document.getElementById("productId").value.trim();
  const name = document.getElementById("productName").value.trim();
  const category = document.getElementById("productCategory").value;
  const price = Number(document.getElementById("productPrice").value);
  const quantity = Number(document.getElementById("productQuantity").value);

  if (id === "" || name === "" || category === "" || price <= 0 || quantity < 0 ||
      !Number.isInteger(quantity)) {
    showMessage("productFormMessage", "Please enter valid product information.", "error");
    return;
  }

  const duplicateIndex = products.findIndex(function(product) {
    return product.id.toLowerCase() === id.toLowerCase();
  });

  if (duplicateIndex !== -1 && duplicateIndex !== editProductIndex) {
    showMessage("productFormMessage", "This Product ID already exists. Use a different ID.", "error");
    return;
  }

  const productData = {
    id: id,
    name: name,
    category: category,
    price: price,
    quantity: quantity
  };

  if (editProductIndex === -1) {
    products.push(productData);
    showMessage("productFormMessage", "Product added successfully.", "success");
  } else {
    products[editProductIndex] = productData;
    showMessage("productFormMessage", "Product updated successfully.", "success");
  }

  saveProducts(products);
  displayProducts(document.getElementById("productSearch").value);
  resetProductForm();
}



function displayStockAlerts() {
  const tableBody = document.getElementById("stockAlertsTable");

  if (tableBody === null) return;

  const products = loadProducts();
  tableBody.innerHTML = "";

  let lowStockCount = 0;
  let outOfStockCount = 0;
  let alertCount = 0;

  for (const product of products) {
    const quantity = Number(product.quantity);

    if (quantity <= LOW_STOCK_LIMIT) {
      const row = document.createElement("tr");
      const status = getStockStatus(quantity);

      if (quantity === 0) {
        outOfStockCount++;
      } else {
        lowStockCount++;
      }

      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${quantity}</td>
        <td><span class="status ${getStatusClass(quantity)}">${status}</span></td>
        <td><a href="Supplier-restock.html" class="btn btn-small">Restock</a></td>
      `;

      tableBody.appendChild(row);
      alertCount++;
    }
  }

  document.getElementById("alertLowStock").textContent = lowStockCount;
  document.getElementById("alertOutOfStock").textContent = outOfStockCount;

  const message = document.getElementById("stockAlertMessage");

  if (alertCount === 0) {
    tableBody.innerHTML = '<tr><td colspan="6">All products have sufficient stock.</td></tr>';
    message.textContent = "There are currently no stock alerts.";
  } else {
    message.textContent = alertCount + " product(s) require attention.";
  }
}



function fillRestockProductList() {
  const productSelect = document.getElementById("restockProduct");

  if (productSelect === null) return;

  const products = loadProducts();
  productSelect.innerHTML = '<option value="">Select a product</option>';

  for (const product of products) {
    const option = document.createElement("option");
    option.value = product.id;
    option.textContent = product.id + " - " + product.name + " (Current: " + product.quantity + ")";
    productSelect.appendChild(option);
  }
}

function displayRestockHistory() {
  const tableBody = document.getElementById("restockHistoryTable");

  if (tableBody === null) return;

  const history = loadRestockHistory();
  tableBody.innerHTML = "";

  for (const entry of history) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.productName}</td>
      <td>${entry.supplier}</td>
      <td>${entry.phone}</td>
      <td>${entry.quantity}</td>
    `;

    tableBody.appendChild(row);
  }

  const message = document.getElementById("restockHistoryMessage");

  if (history.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="5">No restock records yet.</td></tr>';
    message.textContent = "Restock transactions will appear here.";
  } else {
    message.textContent = "Total restock records: " + history.length;
  }
}

function processRestock(event) {
  event.preventDefault();

  const productId = document.getElementById("restockProduct").value;
  const supplier = document.getElementById("supplierName").value.trim();
  const phone = document.getElementById("supplierPhone").value.trim();
  const quantity = Number(document.getElementById("restockQuantity").value);
  const date = document.getElementById("restockDate").value;

  if (productId === "" || supplier === "" || phone === "" ||
      !Number.isInteger(quantity) || quantity <= 0 || date === "") {
    showMessage("restockMessage", "Please complete all fields with valid information.", "error");
    return;
  }

  const products = loadProducts();
  const productIndex = products.findIndex(function(product) {
    return product.id === productId;
  });

  if (productIndex === -1) {
    showMessage("restockMessage", "The selected product could not be found.", "error");
    return;
  }

  products[productIndex].quantity = Number(products[productIndex].quantity) + quantity;
  saveProducts(products);

  const history = loadRestockHistory();

  history.unshift({
    date: date,
    productId: productId,
    productName: products[productIndex].name,
    supplier: supplier,
    phone: phone,
    quantity: quantity
  });

  saveRestockHistory(history);

  document.getElementById("restockForm").reset();
  showMessage("restockMessage", "Stock updated successfully for " + products[productIndex].name + ".", "success");

  fillRestockProductList();
  displayRestockHistory();
}



document.addEventListener("DOMContentLoaded", function() {

  // Dashboard
  if (document.getElementById("recentProductsTable") !== null) {
    generateReport();
    displayRecentProducts();
  }

  // Product Catalog
  const productForm = document.getElementById("productForm");

  if (productForm !== null) {
    productForm.addEventListener("submit", saveProduct);

    document.getElementById("productSearch").addEventListener("input", function() {
      displayProducts(this.value);
    });

    document.getElementById("cancelEditButton").addEventListener("click", resetProductForm);

    displayProducts();
  }

  // Stock Alerts
  if (document.getElementById("stockAlertsTable") !== null) {
    displayStockAlerts();
  }

  // Supplier Restock
  const restockForm = document.getElementById("restockForm");

  if (restockForm !== null) {
    restockForm.addEventListener("submit", processRestock);
    fillRestockProductList();
    displayRestockHistory();
  }

});
