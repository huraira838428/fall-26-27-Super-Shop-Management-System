/* =====================================================================
   common.js - Shared helper functions used by the Admin pages
   The structure follows the supplied example: simple functions,
   getElementById(), error spans, messages and array helpers.
   ===================================================================== */

function showError(fieldId, message) {
    let errorBox = document.getElementById(fieldId + "Error");
    if (errorBox !== null) { errorBox.textContent = message; }
    let field = document.getElementById(fieldId);
    if (field !== null) { field.classList.add("input-error"); }
}

function clearError(fieldId) {
    let errorBox = document.getElementById(fieldId + "Error");
    if (errorBox !== null) { errorBox.textContent = ""; }
    let field = document.getElementById(fieldId);
    if (field !== null) { field.classList.remove("input-error"); }
}

function clearErrors(fieldIds) {
    for (let i = 0; i < fieldIds.length; i++) { clearError(fieldIds[i]); }
}

function showMessage(boxId, message, type) {
    let box = document.getElementById(boxId);
    if (box !== null) {
        box.textContent = message;
        box.className = "message " + type;
        box.style.display = "block";
    }
}

function hideMessage(boxId) {
    let box = document.getElementById(boxId);
    if (box !== null) { box.style.display = "none"; }
}

function isEmpty(value) { return value.trim() === ""; }

function isValidEmail(email) {
    let atPosition = email.indexOf("@");
    let dotPosition = email.indexOf(".", atPosition);
    if (atPosition < 1 || dotPosition < atPosition + 2 || dotPosition === email.length - 1) {
        return false;
    }
    return true;
}

function isDigitsOnly(text) {
    if (text.length === 0) { return false; }
    let digits = "0123456789";
    for (let i = 0; i < text.length; i++) {
        if (digits.indexOf(text[i]) === -1) { return false; }
    }
    return true;
}

function containsText(text, keyword) {
    return String(text).toLowerCase().indexOf(keyword.toLowerCase()) !== -1;
}

function nowString() {
    let now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    return now.getFullYear() + "-" + month + "-" + day + " " + hours + ":" + minutes;
}

function todayString() {
    let now = new Date();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    if (month < 10) { month = "0" + month; }
    if (day < 10) { day = "0" + day; }
    return now.getFullYear() + "-" + month + "-" + day;
}

function nextId(prefix, list) {
    let biggest = 0;
    for (let i = 0; i < list.length; i++) {
        let numberText = String(list[i].id).split("-")[1];
        let number = Number(numberText);
        if (number > biggest) { biggest = number; }
    }
    let nextNumber = String(biggest + 1);
    while (nextNumber.length < 3) { nextNumber = "0" + nextNumber; }
    return prefix + "-" + nextNumber;
}

function escapeHTML(value) {
    return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;")
        .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function addLog(type, message) {
    let signedIn = getCurrentUser();
    let userName = signedIn ? signedIn.username : "system";
    activityLog.push({ time: nowString(), user: userName, type: type, message: message });
    saveActivityLog();
}

function recordLoginAttempt(email, role, result) {
    loginHistory.push({ time: nowString(), email: email, role: role, result: result });
    saveLoginHistory();
}

function getCurrentUser() {
    let savedUser = sessionStorage.getItem("ss_currentUser");
    if (savedUser === null) { savedUser = localStorage.getItem("ss_rememberedUser"); }
    if (savedUser === null) { return null; }
    try { return JSON.parse(savedUser); }
    catch (error) { return null; }
}

function setCurrentUser(user, remember) {
    let safeUser = { id: user.id, name: user.name, username: user.username, email: user.email, role: user.role };
    sessionStorage.removeItem("ss_currentUser");
    localStorage.removeItem("ss_rememberedUser");
    if (remember) {
        localStorage.setItem("ss_rememberedUser", JSON.stringify(safeUser));
    } else {
        sessionStorage.setItem("ss_currentUser", JSON.stringify(safeUser));
    }
}

function requireAdmin() {
    let signedIn = getCurrentUser();
    if (signedIn === null || signedIn.role !== "Admin") {
        alert("Please login with an Admin account to open this page.");
        window.location.href = "../index.html";
        return false;
    }
    let nameBox = document.getElementById("loggedInName");
    if (nameBox !== null) { nameBox.textContent = signedIn.name; }
    return true;
}

function logout() {
    sessionStorage.removeItem("ss_currentUser");
    localStorage.removeItem("ss_rememberedUser");
    window.location.href = "../index.html";
}
