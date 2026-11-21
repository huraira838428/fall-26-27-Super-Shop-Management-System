/* =====================================================================
   audit-security.js - Login history, activity log and settings
   ===================================================================== */

function loadSecurityPage() {
    if (!requireAdmin()) { return; }
    let successful = 0;
    let failed = 0;
    let blocked = 0;
    for (let i = 0; i < loginHistory.length; i++) {
        if (loginHistory[i].result === "Successful") { successful++; }
        if (loginHistory[i].result === "Failed") { failed++; }
    }
    for (let i = 0; i < users.length; i++) {
        if (users[i].status === "Blocked") { blocked++; }
    }
    document.getElementById("statLoginTotal").textContent = loginHistory.length;
    document.getElementById("statLoginSuccess").textContent = successful;
    document.getElementById("statLoginFailed").textContent = failed;
    document.getElementById("statBlockedUsers").textContent = blocked;

    document.getElementById("settingLoginNotice").checked = systemSettings.loginNotice;
    document.getElementById("settingFailedNotice").checked = systemSettings.failedNotice;
    document.getElementById("settingSessionNotice").checked = systemSettings.sessionNotice;

    loadLogUserFilter();
    renderLoginHistory();
    renderActivityLog();
}

function renderLoginHistory() {
    let keyword = document.getElementById("loginSearch").value;
    let statusFilter = document.getElementById("loginStatusFilter").value;
    let rows = "";
    let shown = 0;
    for (let i = loginHistory.length - 1; i >= 0; i--) {
        let item = loginHistory[i];
        if (containsText(item.email, keyword) || containsText(item.role, keyword)) {
            if (statusFilter === "All" || item.result === statusFilter) {
                rows += "<tr><td>" + escapeHTML(item.time) + "</td><td>" + escapeHTML(item.email) +
                    "</td><td>" + escapeHTML(item.role) + "</td><td>" + escapeHTML(item.result) + "</td></tr>";
                shown++;
            }
        }
    }
    if (shown === 0) { rows = "<tr><td colspan='4' class='empty-row'>No login records found.</td></tr>"; }
    document.getElementById("loginTableBody").innerHTML = rows;
}

function loadLogUserFilter() {
    let select = document.getElementById("logUserFilter");
    let names = [];
    for (let i = 0; i < activityLog.length; i++) {
        if (names.indexOf(activityLog[i].user) === -1) { names.push(activityLog[i].user); }
    }
    let html = "<option value='All'>All Users</option>";
    for (let i = 0; i < names.length; i++) {
        html += "<option value='" + escapeHTML(names[i]) + "'>" + escapeHTML(names[i]) + "</option>";
    }
    select.innerHTML = html;
}

function renderActivityLog() {
    let typeFilter = document.getElementById("logTypeFilter").value;
    let userFilter = document.getElementById("logUserFilter").value;
    let board = document.getElementById("logBoard");
    board.innerHTML = "";
    let shown = 0;

    for (let i = activityLog.length - 1; i >= 0; i--) {
        let entry = activityLog[i];
        if ((typeFilter === "All" || entry.type === typeFilter) &&
            (userFilter === "All" || entry.user === userFilter)) {
            let item = document.createElement("div");
            item.className = "log-item";
            item.innerHTML = "<span class='log-time'>" + escapeHTML(entry.time) + " | " + escapeHTML(entry.user) +
                "</span><br><strong>" + escapeHTML(entry.type) + "</strong><br>" + escapeHTML(entry.message);
            board.appendChild(item);
            shown++;
        }
    }
    if (shown === 0) { board.innerHTML = "<p class='empty-row'>No activity to show.</p>"; }
    document.getElementById("logCount").textContent = shown + " activity record(s).";
}

function saveSecuritySettings() {
    systemSettings.loginNotice = document.getElementById("settingLoginNotice").checked;
    systemSettings.failedNotice = document.getElementById("settingFailedNotice").checked;
    systemSettings.sessionNotice = document.getElementById("settingSessionNotice").checked;
    saveSystemSettings();
    addLog("Settings", "Updated security notification settings");
    showMessage("securityMessage", "Security settings saved in this browser demo.", "success");
    return false;
}

function clearActivityLog() {
    if (confirm("Clear all activity log entries?")) {
        activityLog = [];
        saveActivityLog();
        addLog("Security", "Activity log was cleared");
        loadLogUserFilter();
        renderActivityLog();
    }
}

loadSecurityPage();
