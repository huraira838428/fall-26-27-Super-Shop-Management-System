/* =====================================================================
   register.js - Validate and create a user registration request
   New users are Pending; Admin must approve staff accounts.
   ===================================================================== */

function validateRegister() {
    let name = document.getElementById("name").value.trim();
    let username = document.getElementById("username").value.trim();
    let email = document.getElementById("email").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let address = document.getElementById("address").value.trim();
    let role = document.getElementById("role").value;
    let password = document.getElementById("password").value;
    let confirm = document.getElementById("confirm").value;
    let isValid = true;

    clearRegisterErrors();

    if (name.length < 3) { showError("name", "Name must be at least 3 characters."); isValid = false; }
    if (username.length < 4) { showError("username", "Username must be at least 4 characters."); isValid = false; }
    if (usernameExists(username)) { showError("username", "This username is already used."); isValid = false; }
    if (!isValidEmail(email)) { showError("email", "Enter a valid email address."); isValid = false; }
    if (emailExists(email)) { showError("email", "This email is already registered."); isValid = false; }
    if (!isDigitsOnly(phone) || phone.length < 10 || phone.length > 15) { showError("phone", "Enter a phone number with 10 to 15 digits."); isValid = false; }
    if (isEmpty(address)) { showError("address", "Please enter your address."); isValid = false; }
    if (role === "") { showError("role", "Please select a role."); isValid = false; }
    if (password.length < 8) { showError("password", "Password must be at least 8 characters."); isValid = false; }
    if (password !== confirm) { showError("confirm", "Passwords do not match."); isValid = false; }

    if (!isValid) { return false; }

    let newUser = {
        id: nextId("U", users), name: name, username: username,
        email: email, phone: phone, address: address,
        password: password, role: role, status: "Pending"
    };

    users.push(newUser);
    saveUsers();
    addLog("User", "New registration request from " + name + " for " + role);
    showMessage("registerMessage", "Registration submitted. Your account is Pending until the Admin approves it. You can now return to Login.", "success");
    document.getElementById("registerForm").reset();
    return false;
}

function usernameExists(username) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].username.toLowerCase() === username.toLowerCase()) { return true; }
    }
    return false;
}

function emailExists(email) {
    for (let i = 0; i < users.length; i++) {
        if (users[i].email.toLowerCase() === email.toLowerCase()) { return true; }
    }
    return false;
}

function clearRegisterErrors() {
    clearErrors(["name", "username", "email", "phone", "address", "role", "password", "confirm"]);
    hideMessage("registerMessage");
}
