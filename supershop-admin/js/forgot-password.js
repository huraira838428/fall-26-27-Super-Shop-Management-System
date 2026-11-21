/* =====================================================================
   forgot-password.js - Front-end demo validation only.
   No reset email is sent and no password is changed.
   ===================================================================== */

function validateForgotPassword() {
    let email = document.getElementById("email").value.trim();
    clearForgotErrors();

    if (!isValidEmail(email)) {
        showError("email", "Please enter a valid email address.");
        return false;
    }

    let accountFound = false;
    for (let i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email.toLowerCase()) {
            accountFound = true;
            break;
        }
    }

    if (accountFound) {
        showMessage("forgotMessage", "Account found. This demo does not send email or reset passwords. Please contact the Admin.", "info");
    } else {
        showMessage("forgotMessage", "If this email belongs to an account, contact the Admin for password support.", "info");
    }
    return false;
}

function clearForgotErrors() {
    clearErrors(["email"]);
    hideMessage("forgotMessage");
}
