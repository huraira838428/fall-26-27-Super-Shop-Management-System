
// SuperShop Management System JavaScript

// Employee Task Tracker
const taskForm = document.querySelector("[data-demo-form]");

if (taskForm) {
    taskForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const inputs = taskForm.querySelectorAll("input, select");

        const task = inputs[0].value;
        const employee = inputs[1].value;
        const date = inputs[2].value;
        const priority = inputs[3].value;

        const table = document.querySelector(".data-table tbody");

        if (table) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${task}</td>
                <td>${employee}</td>
                <td>${date}</td>
                <td>${priority}</td>
                <td><span class="tag low">Pending</span></td>
            `;

            table.appendChild(row);
        }

        alert("Task added successfully!");

        taskForm.reset();
    });
}

// Notification Button
const notification = document.querySelector(".icon-btn");

if (notification) {
    notification.addEventListener("click", function () {
        alert("No new notifications!");
    });
}

// Welcome Message
console.log("Welcome to SuperShop Management System!");
