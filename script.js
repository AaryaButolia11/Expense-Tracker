// Wait for the entire DOM to load before running any script
document.addEventListener("DOMContentLoaded", () => {
  // Get references to DOM elements
  const expenseForm = document.getElementById("expense-form");
  const expenseNameInput = document.getElementById("expense-name");
  const expenseAmountInput = document.getElementById("expense-amount");
  const expenseList = document.getElementById("expense-list");
  const totalAmountDisplay = document.getElementById("total-amount");
  const themeToggleBtn = document.querySelector(".change-theme");

  // Load stored expenses from localStorage or initialize with empty array
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Initialize total amount
  let totalAmount = calculateTotal();

  // Initial rendering of expenses and total on page load
  renderExpenses();
  updateTotal();

  // Handle form submission to add a new expense
  expenseForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = expenseNameInput.value.trim();
    const amount = parseFloat(expenseAmountInput.value.trim());

    // Validate input
    if (name !== "" && !isNaN(amount) && amount > 0) {
      const newExpense = {
        id: Date.now(), // Unique identifier
        name: name,
        amount: amount,
      };

      expenses.push(newExpense);
      saveExpensesTolocal(); // Save to localStorage
      renderExpenses(); // Update the list
      updateTotal(); // Update total amount

      // Clear form inputs
      expenseNameInput.value = "";
      expenseAmountInput.value = "";
    }
  });

  // Render all expenses to the list
  function renderExpenses() {
    expenseList.innerHTML = ""; // Clear the list before rendering
    expenses.forEach((expense) => {
      const li = document.createElement("li");
      li.innerHTML = `
      ${expense.name} - $${expense.amount}
    <button class="delete-btn" data-id="${expense.id}">Delete</button>
`;

      expenseList.appendChild(li);
    });
  }

  // Calculate the total of all expenses
  function calculateTotal() {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  // Save current expenses array to localStorage
  function saveExpensesTolocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  // Update the total amount displayed in the UI
  function updateTotal() {
    totalAmount = calculateTotal();
    totalAmountDisplay.textContent = totalAmount.toFixed(2);
  }

  // Handle deletion of an expense from the list
  expenseList.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const expenseId = parseInt(e.target.getAttribute("data-id"));
      expenses = expenses.filter((expense) => expense.id !== expenseId);

      saveExpensesTolocal();
      renderExpenses();
      updateTotal();
    }
  });

  // === THEME TOGGLING LOGIC ===

  // Apply saved theme preference on load
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }

  // Toggle between light and dark themes on button click
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    // Save the user's theme preference
    const isLight = document.body.classList.contains("light-theme");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });
});
