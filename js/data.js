/* =====================================================================
   data.js - Sample data for the Super Shop Management System
   ---------------------------------------------------------------------
   Arrays of objects are used like the supplied learning example.
   localStorage keeps demo records available when you move between pages.
   This is front-end demo storage, not a secure production database.
   ===================================================================== */

function loadData(key, startingData) {
    let savedText = localStorage.getItem(key);
    if (savedText === null) {
        localStorage.setItem(key, JSON.stringify(startingData));
        return startingData;
    }
    try {
        let savedData = JSON.parse(savedText);
        return savedData;
    } catch (error) {
        localStorage.setItem(key, JSON.stringify(startingData));
        return startingData;
    }
}

let users = loadData("ss_users", [
    { id: "U-001", name: "Admin User", username: "admin", email: "admin@supershop.com", phone: "01711000001", address: "Dhaka", password: "Admin@123", role: "Admin", status: "Active" },
    { id: "U-002", name: "Rahim Ahmed", username: "rahim", email: "rahim@supershop.com", phone: "01711000002", address: "Dhaka", password: "Shop@1234", role: "Store Manager", status: "Active" },
    { id: "U-003", name: "Karim Hasan", username: "karim", email: "karim@supershop.com", phone: "01711000003", address: "Dhaka", password: "Shop@1234", role: "Inventory Manager", status: "Active" },
    { id: "U-004", name: "Nusrat Jahan", username: "nusrat", email: "nusrat@supershop.com", phone: "01711000004", address: "Dhaka", password: "Shop@1234", role: "Cashier", status: "Active" },
    { id: "U-005", name: "Sadia Akter", username: "sadia", email: "sadia@supershop.com", phone: "01711000005", address: "Dhaka", password: "Shop@1234", role: "Customer", status: "Active" }
]);

let products = loadData("ss_products", [
    { id: "P-001", name: "Premium Rice", category: "Grocery", price: 75, quantity: 85, reorderLevel: 20 },
    { id: "P-002", name: "Mineral Water", category: "Beverages", price: 20, quantity: 12, reorderLevel: 25 },
    { id: "P-003", name: "Potato Chips", category: "Snacks", price: 30, quantity: 64, reorderLevel: 15 },
    { id: "P-004", name: "Fresh Milk", category: "Dairy", price: 90, quantity: 18, reorderLevel: 20 },
    { id: "P-005", name: "Dish Soap", category: "Household", price: 120, quantity: 0, reorderLevel: 10 }
]);

let transactions = loadData("ss_transactions", [
    { id: "S-001", customer: "Sadia Akter", amount: 1250, date: "2026-11-20", payment: "Mobile Banking", status: "Completed" },
    { id: "S-002", customer: "Rahim Ahmed", amount: 860, date: "2026-11-21", payment: "Card", status: "Completed" },
    { id: "S-003", customer: "Walk-in Customer", amount: 430, date: "2026-11-21", payment: "Cash", status: "Completed" }
]);

let activityLog = loadData("ss_activityLog", [
    { time: "2026-11-20 09:12", user: "admin", type: "User", message: "Created Inventory Manager account" },
    { time: "2026-11-20 10:40", user: "rahim", type: "Settings", message: "Reviewed daily sales dashboard" },
    { time: "2026-11-21 08:55", user: "admin", type: "Security", message: "Admin opened the control panel" }
]);

let loginHistory = loadData("ss_loginHistory", [
    { time: "2026-11-20 09:00", email: "admin@supershop.com", role: "Admin", result: "Successful" },
    { time: "2026-11-20 09:15", email: "rahim@supershop.com", role: "Store Manager", result: "Successful" },
    { time: "2026-11-21 08:30", email: "unknown@example.com", role: "Admin", result: "Failed" }
]);

let backupHistory = loadData("ss_backupHistory", []);
let systemSettings = loadData("ss_systemSettings", {
    loginNotice: true,
    failedNotice: true,
    sessionNotice: false
});

function saveUsers() { localStorage.setItem("ss_users", JSON.stringify(users)); }
function saveProducts() { localStorage.setItem("ss_products", JSON.stringify(products)); }
function saveTransactions() { localStorage.setItem("ss_transactions", JSON.stringify(transactions)); }
function saveActivityLog() { localStorage.setItem("ss_activityLog", JSON.stringify(activityLog)); }
function saveLoginHistory() { localStorage.setItem("ss_loginHistory", JSON.stringify(loginHistory)); }
function saveBackupHistory() { localStorage.setItem("ss_backupHistory", JSON.stringify(backupHistory)); }
function saveSystemSettings() { localStorage.setItem("ss_systemSettings", JSON.stringify(systemSettings)); }
