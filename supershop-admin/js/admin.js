/* =====================================================================
   admin.js - Admin dashboard summary and recent activity list
   ===================================================================== */

function loadAdminDashboard() {
    if (!requireAdmin()) { return; }

    let active = 0;
    let pending = 0;
    let lowStock = 0;
    let todaySales = 0;

    for (let i = 0; i < users.length; i++) {
        if (users[i].status === "Active") { active++; }
        if (users[i].status === "Pending") { pending++; }
    }

    for (let i = 0; i < products.length; i++) {
        if (products[i].quantity <= products[i].reorderLevel) { lowStock++; }
    }

    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].date === todayString() && transactions[i].status === "Completed") {
            todaySales += Number(transactions[i].amount);
        }
    }

    document.getElementById("statUsers").textContent = users.length;
    document.getElementById("statActive").textContent = active;
    document.getElementById("statPending").textContent = pending;
    document.getElementById("statProducts").textContent = products.length;
    document.getElementById("statLowStock").textContent = lowStock;
    document.getElementById("statSales").textContent = "৳" + todaySales.toFixed(2);

    let rows = "";
    let shown = 0;
    for (let i = activityLog.length - 1; i >= 0 && shown < 8; i--) {
        let item = activityLog[i];
        rows += "<tr>" +
            "<td>" + escapeHTML(item.time) + "</td>" +
            "<td>" + escapeHTML(item.user) + "</td>" +
            "<td>" + escapeHTML(item.type) + "</td>" +
            "<td>" + escapeHTML(item.message) + "</td>" +
            "</tr>";
        shown++;
    }
    if (shown === 0) { rows = "<tr><td colspan='4' class='empty-row'>No activity recorded.</td></tr>"; }
    document.getElementById("recentActivityBody").innerHTML = rows;
    document.getElementById("activityCount").textContent = "Showing the latest " + shown + " activity record(s).";
}

loadAdminDashboard();
