/* =====================================================================
   backup-reports.js - Download demo backup and generate CSV reports
   ===================================================================== */

let lastReportRows = [];
let lastReportName = "supershop-report.csv";

function loadBackupPage() {
    if (!requireAdmin()) { return; }
    document.getElementById("backupProductCount").textContent = products.length;
    document.getElementById("backupUserCount").textContent = users.length;
    document.getElementById("backupTransactionCount").textContent = transactions.length;
    document.getElementById("backupRecordCount").textContent = backupHistory.length;
    renderBackupHistory();
}

function downloadTextFile(fileName, content, contentType) {
    let blob = new Blob([content], { type: contentType });
    let fileURL = URL.createObjectURL(blob);
    let link = document.createElement("a");
    link.href = fileURL;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileURL);
}

function createBackup() {
    let backupType = document.getElementById("backupType").value;
    let backupData = {
        app: "Super Shop Management System",
        backupType: backupType,
        createdAt: nowString(),
        products: products,
        transactions: transactions,
        activityLog: activityLog,
        systemSettings: systemSettings
    };

    if (backupType === "Products and transactions") {
        backupData.activityLog = [];
    }
    if (backupType === "Activity records") {
        backupData.products = [];
        backupData.transactions = [];
    }

    let fileName = "supershop-backup-" + todayString() + ".json";
    downloadTextFile(fileName, JSON.stringify(backupData, null, 4), "application/json");

    let signedIn = getCurrentUser();
    backupHistory.push({
        id: nextId("BK", backupHistory), date: nowString(), type: backupType,
        user: signedIn ? signedIn.username : "admin", status: "Downloaded"
    });
    saveBackupHistory();
    addLog("Backup", "Downloaded " + backupType + " backup file");
    showMessage("backupMessage", "Backup JSON file has been downloaded. Passwords and user account records are not included.", "success");
    loadBackupPage();
    return false;
}

function restoreBackup() {
    let fileInput = document.getElementById("backupFile");
    if (fileInput.files.length === 0) {
        showMessage("backupMessage", "Please select a JSON backup file first.", "error");
        return;
    }

    let reader = new FileReader();
    reader.onload = function() {
        try {
            let backupData = JSON.parse(reader.result);
            if (backupData.app !== "Super Shop Management System") {
                showMessage("backupMessage", "This is not a Super Shop backup file.", "error");
                return;
            }
            if (!confirm("Restore products, transactions and activity records from this file?")) { return; }

            if (Array.isArray(backupData.products) && backupData.products.length > 0) {
                products = backupData.products;
                saveProducts();
            }
            if (Array.isArray(backupData.transactions) && backupData.transactions.length > 0) {
                transactions = backupData.transactions;
                saveTransactions();
            }
            if (Array.isArray(backupData.activityLog)) {
                activityLog = backupData.activityLog;
                saveActivityLog();
            }
            if (backupData.systemSettings) {
                systemSettings = backupData.systemSettings;
                saveSystemSettings();
            }
            addLog("Backup", "Restored demo records from a JSON backup");
            showMessage("backupMessage", "Demo records restored. User accounts were not changed.", "success");
            loadBackupPage();
        } catch (error) {
            showMessage("backupMessage", "The selected file is not valid JSON.", "error");
        }
    };
    reader.readAsText(fileInput.files[0]);
}

function generateReport() {
    let type = document.getElementById("reportType").value;
    let startDate = document.getElementById("reportStartDate").value;
    let endDate = document.getElementById("reportEndDate").value;
    if (startDate !== "" && endDate !== "" && startDate > endDate) {
        showMessage("reportMessage", "Start date cannot be after end date.", "error");
        return false;
    }

    lastReportRows = [];
    if (type === "Sales") {
        lastReportRows.push(["Transaction ID", "Customer", "Date", "Payment", "Amount", "Status"]);
        for (let i = 0; i < transactions.length; i++) {
            let item = transactions[i];
            if (dateIsInRange(item.date, startDate, endDate)) {
                lastReportRows.push([item.id, item.customer, item.date, item.payment, item.amount, item.status]);
            }
        }
    } else if (type === "Inventory") {
        lastReportRows.push(["Product ID", "Product", "Category", "Price", "Quantity", "Reorder Level"]);
        for (let i = 0; i < products.length; i++) {
            let item = products[i];
            lastReportRows.push([item.id, item.name, item.category, item.price, item.quantity, item.reorderLevel]);
        }
    } else if (type === "Users") {
        lastReportRows.push(["User ID", "Name", "Username", "Email", "Role", "Status"]);
        for (let i = 0; i < users.length; i++) {
            let item = users[i];
            lastReportRows.push([item.id, item.name, item.username, item.email, item.role, item.status]);
        }
    } else if (type === "Activity") {
        lastReportRows.push(["Date & Time", "User", "Type", "Description"]);
        for (let i = 0; i < activityLog.length; i++) {
            let item = activityLog[i];
            let datePart = item.time.substring(0, 10);
            if (dateIsInRange(datePart, startDate, endDate)) {
                lastReportRows.push([item.time, item.user, item.type, item.message]);
            }
        }
    }

    let html = "<h4>" + escapeHTML(type) + " Report Preview</h4>";
    html += "<p class='hint'>" + (lastReportRows.length - 1) + " data row(s) found.</p>";
    html += "<div class='table-wrapper'><table class='data-table'><thead><tr>";
    for (let c = 0; c < lastReportRows[0].length; c++) { html += "<th>" + escapeHTML(lastReportRows[0][c]) + "</th>"; }
    html += "</tr></thead><tbody>";
    for (let r = 1; r < lastReportRows.length; r++) {
        html += "<tr>";
        for (let c = 0; c < lastReportRows[r].length; c++) { html += "<td>" + escapeHTML(lastReportRows[r][c]) + "</td>"; }
        html += "</tr>";
    }
    if (lastReportRows.length === 1) { html += "<tr><td colspan='" + lastReportRows[0].length + "'>No records found.</td></tr>"; }
    html += "</tbody></table></div>";
    document.getElementById("reportPreview").innerHTML = html;
    document.getElementById("downloadReportButton").style.display = "inline-block";
    lastReportName = "supershop-" + type.toLowerCase() + "-report.csv";
    showMessage("reportMessage", "Report preview generated. You can download the CSV file.", "success");
    addLog("Report", "Generated " + type + " report");
    return false;
}

function dateIsInRange(dateText, startDate, endDate) {
    if (startDate !== "" && dateText < startDate) { return false; }
    if (endDate !== "" && dateText > endDate) { return false; }
    return true;
}

function downloadReport() {
    if (lastReportRows.length === 0) { return; }
    let csv = "";
    for (let r = 0; r < lastReportRows.length; r++) {
        let values = [];
        for (let c = 0; c < lastReportRows[r].length; c++) {
            let value = String(lastReportRows[r][c]).replace(/"/g, '""');
            values.push('"' + value + '"');
        }
        csv += values.join(",") + "\n";
    }
    downloadTextFile(lastReportName, csv, "text/csv;charset=utf-8");
}

function renderBackupHistory() {
    let rows = "";
    for (let i = backupHistory.length - 1; i >= 0; i--) {
        let item = backupHistory[i];
        rows += "<tr><td>" + escapeHTML(item.id) + "</td><td>" + escapeHTML(item.date) +
            "</td><td>" + escapeHTML(item.type) + "</td><td>" + escapeHTML(item.user) +
            "</td><td>" + escapeHTML(item.status) + "</td></tr>";
    }
    if (rows === "") { rows = "<tr><td colspan='5' class='empty-row'>No backup downloads yet.</td></tr>"; }
    document.getElementById("backupTableBody").innerHTML = rows;
}

loadBackupPage();
