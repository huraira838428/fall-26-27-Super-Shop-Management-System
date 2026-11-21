/* =====================================================================
   login.js - Validate login and open the Admin dashboard
   Pattern: <form onsubmit="return validateLogin()">.
   ===================================================================== */

function validateLogin() {
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value;
    let role = document.getElementById("role").value;
    let isValid = true;

    clearErrors(["email", "password", "role"]);
    hideMessage("loginMessage");

    if (isEmpty(email) || !isValidEmail(email)) {
        showError("email", "Please enter a valid email address.");
        isValid = false;
    }
    if (password.length < 8) {
        showError("password", "Password must be at least 8 characters.");
        isValid = false;
    }
    if (role === "") {
        showError("role", "Please select your role.");
        isValid = false;
    }
    if (!isValid) { return false; }

    let foundUser = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email.toLowerCase()) {
            foundUser = users[i];
            break;
        }
    }

    if (foundUser === null || foundUser.password !== password || foundUser.role !== role) {
        recordLoginAttempt(email, role, "Failed");
        showMessage("loginMessage", "Email, password or selected role is incorrect.", "error");
        return false;
    }

    if (foundUser.status === "Pending") {
        recordLoginAttempt(email, role, "Pending");
        showMessage("loginMessage", "Your account is waiting for Admin approval.", "info");
        return false;
    }
    if (foundUser.status === "Blocked") {
        recordLoginAttempt(email, role, "Blocked");
        showMessage("loginMessage", "This account is blocked. Please contact the Admin.", "error");
        return false;
    }

    recordLoginAttempt(email, role, "Successful");
    setCurrentUser(foundUser, document.getElementById("remember").checked);
    addLog("Security", "Successful login for " + foundUser.email);

    if (foundUser.role === "Admin") {
        window.location.href = "admin/admin.html";
        return false;
    }

    showMessage("loginMessage", "Login details are correct. This package currently includes the Admin dashboard only; ask the Admin for the other role dashboard.", "info");
    return false;
}

function togglePassword() {
    let passwordInput = document.getElementById("password");
    if (document.getElementById("showPassword").checked) {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

function clearLoginErrors() {
    clearErrors(["email", "password", "role"]);
    hideMessage("loginMessage");
}
