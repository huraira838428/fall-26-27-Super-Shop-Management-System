/* =====================================================================
   role-access.js - Create, Read, Update, Delete and Search Users
   This follows the CRUD pattern in the supplied admin.js example.
   ===================================================================== */

let editUserIndex = -1;

function renderUsers() {
    if (!requireAdmin()) { return; }
    let keyword = document.getElementById("userSearch").value;
    let roleFilter = document.getElementById("userRoleFilter").value;
    let statusFilter = document.getElementById("userStatusFilter").value;
    let rows = "";
    let shown = 0;

    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let matchesKeyword = containsText(user.name, keyword) || containsText(user.username, keyword) ||
            containsText(user.email, keyword) || containsText(user.id, keyword);
        let matchesRole = (roleFilter === "All" || user.role === roleFilter);
        let matchesStatus = (statusFilter === "All" || user.status === statusFilter);

        if (matchesKeyword && matchesRole && matchesStatus) {
            let statusClass = "badge grey";
            if (user.status === "Active") { statusClass = "badge green"; }
            if (user.status === "Pending") { statusClass = "badge orange"; }
            if (user.status === "Blocked") { statusClass = "badge red"; }

            let approveButton = "";
            if (user.status === "Pending") {
                approveButton = "<button class='btn btn-small btn-success' type='button' onclick='approveUser(" + i + ")'>Approve</button>";
            }

            rows += "<tr>" +
                "<td>" + escapeHTML(user.id) + "</td>" +
                "<td><strong>" + escapeHTML(user.name) + "</strong><br><span class='hint'>" + escapeHTML(user.email) + "</span></td>" +
                "<td>" + escapeHTML(user.username) + "</td>" +
                "<td>" + escapeHTML(user.role) + "</td>" +
                "<td><span class='" + statusClass + "'>" + escapeHTML(user.status) + "</span></td>" +
                "<td>" + approveButton +
                "<button class='btn btn-small' type='button' onclick='editUser(" + i + ")'>Edit</button>" +
                "<button class='btn btn-small btn-danger' type='button' onclick='deleteUser(" + i + ")'>Delete</button></td>" +
                "</tr>";
            shown++;
        }
    }

    if (shown === 0) { rows = "<tr><td colspan='6' class='empty-row'>No users match your search.</td></tr>"; }
    document.getElementById("userTableBody").innerHTML = rows;
    document.getElementById("userCount").textContent = "Showing " + shown + " of " + users.length + " users.";
}

function saveUser() {
    if (!requireAdmin()) { return false; }
    let name = document.getElementById("userName").value.trim();
    let username = document.getElementById("userUsername").value.trim();
    let email = document.getElementById("userEmail").value.trim();
    let phone = document.getElementById("userPhone").value.trim();
    let password = document.getElementById("userPassword").value;
    let role = document.getElementById("userRole").value;
    let status = document.getElementById("userStatus").value;
    let valid = true;

    clearErrors(["userName", "userUsername", "userEmail", "userPhone", "userPassword", "userRole"]);
    hideMessage("userMessage");

    if (name.length < 3) { showError("userName", "Name must be at least 3 characters."); valid = false; }
    if (username.length < 4) { showError("userUsername", "Username must be at least 4 characters."); valid = false; }
    else if (usernameUsedByOther(username)) { showError("userUsername", "This username is already used."); valid = false; }
    if (!isValidEmail(email)) { showError("userEmail", "Enter a valid email address."); valid = false; }
    else if (emailUsedByOther(email)) { showError("userEmail", "This email is already used."); valid = false; }
    if (phone !== "" && (!isDigitsOnly(phone) || phone.length < 10 || phone.length > 15)) {
        showError("userPhone", "Phone must contain 10 to 15 digits."); valid = false;
    }
    if (editUserIndex === -1 && password.length < 8) { showError("userPassword", "Password must be at least 8 characters."); valid = false; }
    if (editUserIndex !== -1 && password !== "" && password.length < 8) { showError("userPassword", "Password must be at least 8 characters."); valid = false; }
    if (role === "") { showError("userRole", "Please select a role."); valid = false; }
    if (!valid) { return false; }

    if (editUserIndex === -1) {
        let newUser = {
            id: nextId("U", users), name: name, username: username,
            email: email, phone: phone, address: "", password: password,
            role: role, status: status
        };
        users.push(newUser);
        addLog("User", "Created " + role + " account for " + name);
        showMessage("userMessage", "User " + name + " was added successfully.", "success");
    } else {
        let user = users[editUserIndex];
        user.name = name;
        user.username = username;
        user.email = email;
        user.phone = phone;
        user.role = role;
        user.status = status;
        if (password !== "") { user.password = password; }
        addLog("User", "Updated account " + user.id + " for " + name);
        showMessage("userMessage", "User " + name + " was updated successfully.", "success");
    }

    saveUsers();
    resetUserForm(false);
    renderUsers();
    return false;
}

function usernameUsedByOther(username) {
    for (let i = 0; i < users.length; i++) {
        if (i !== editUserIndex && users[i].username.toLowerCase() === username.toLowerCase()) { return true; }
    }
    return false;
}

function emailUsedByOther(email) {
    for (let i = 0; i < users.length; i++) {
        if (i !== editUserIndex && users[i].email.toLowerCase() === email.toLowerCase()) { return true; }
    }
    return false;
}

function editUser(index) {
    let user = users[index];
    editUserIndex = index;
    document.getElementById("userName").value = user.name;
    document.getElementById("userUsername").value = user.username;
    document.getElementById("userEmail").value = user.email;
    document.getElementById("userPhone").value = user.phone || "";
    document.getElementById("userPassword").value = "";
    document.getElementById("userRole").value = user.role;
    document.getElementById("userStatus").value = user.status;
    document.getElementById("userFormTitle").textContent = "Edit User " + user.id;
    document.getElementById("userSaveButton").textContent = "Update User";
    hideMessage("userMessage");
    window.scrollTo(0, 0);
}

function deleteUser(index) {
    let user = users[index];
    let signedIn = getCurrentUser();
    if (signedIn !== null && user.id === signedIn.id) {
        showMessage("userMessage", "You cannot delete the Admin account currently signed in.", "error");
        return;
    }
    if (user.role === "Admin" && users.filter(function(item) { return item.role === "Admin"; }).length <= 1) {
        showMessage("userMessage", "The system must keep at least one Admin account.", "error");
        return;
    }
    if (confirm("Delete the account for " + user.name + "?")) {
        users.splice(index, 1);
        saveUsers();
        addLog("User", "Deleted account " + user.id + " (" + user.name + ")");
        showMessage("userMessage", "User " + user.name + " was deleted.", "info");
        resetUserForm(false);
        renderUsers();
    }
}

function approveUser(index) {
    let user = users[index];
    user.status = "Active";
    saveUsers();
    addLog("Security", "Approved account for " + user.name);
    showMessage("userMessage", user.name + " was approved and can now log in.", "success");
    renderUsers();
}

function resetUserForm(clearNotice) {
    editUserIndex = -1;
    document.getElementById("userForm").reset();
    clearErrors(["userName", "userUsername", "userEmail", "userPhone", "userPassword", "userRole"]);
    document.getElementById("userFormTitle").textContent = "Add New User";
    document.getElementById("userSaveButton").textContent = "Add User";
    if (clearNotice !== false) { hideMessage("userMessage"); }
}

if (requireAdmin()) { renderUsers(); }
