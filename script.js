// ========================================
// LOAD TRANSACTIONS FROM LOCAL STORAGE
// ========================================

// Get saved transactions from browser storage
// If nothing is saved, use an empty array
let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// ========================================
// GET HTML ELEMENTS
// ========================================

let transactionForm = document.getElementById("transactionForm");

let descriptionInput = document.getElementById("description");

let amountInput = document.getElementById("amount");

let typeInput = document.getElementById("type");

let transactionList = document.getElementById("transactionList");

let totalIncomeElement = document.getElementById("totalIncome");

let totalExpenseElement = document.getElementById("totalExpense");

let balanceElement = document.getElementById("balance");

let searchInput = document.getElementById("search");

let transactionCountElement =
    document.getElementById("transactionCount");
// ========================================
// ADD TRANSACTION
// ========================================

// ========================================
// ADD TRANSACTION WITH VALIDATION
// ========================================

transactionForm.addEventListener("submit", function(event) {

    // Prevent page refresh
    event.preventDefault();


    // Get values from the form
    let description = descriptionInput.value.trim();

    let amount = Number(amountInput.value);

    let type = typeInput.value;


    // Check description
    if (description === "") {

        alert("Please enter a description.");

        return;
    }


    // Check amount
    if (amount <= 0 || isNaN(amount)) {

        alert("Please enter a valid amount greater than 0.");

        return;
    }


    // Create transaction object
    let transaction = {

        id: Date.now(),

        description: description,

        amount: amount,

        type: type

    };


    // Add transaction to array
    transactions.push(transaction);


    // Save to LocalStorage
    saveTransactions();


    // Display transactions
    displayTransactions();


    // Update summary
    updateSummary();


    // Clear form
    transactionForm.reset();

});

// ========================================
// DISPLAY TRANSACTIONS
// ========================================

// "list" allows us to display
// all transactions or filtered transactions
function displayTransactions(list = transactions) {

    // Clear current transaction list
    transactionList.innerHTML = "";

     // Update transaction count
transactionCountElement.innerText =
    "(" + list.length + ")";
    // Check if there are no transactions
    if (list.length === 0) {

    transactionList.innerHTML = `
        <div class="empty-state">

            <div class="empty-icon">
                📋
            </div>

            <h5>No Transactions Yet</h5>

            <p>
                Start managing your money by
                adding your first transaction.
            </p>

        </div>
    `;

    return;
}


    // Loop through transactions
    list.forEach(function(transaction) {

        // Create transaction element
        let transactionItem =
            document.createElement("div");


        // Add CSS class
        transactionItem.className =
            "transaction-item";


        // Decide income or expense class
        let amountClass =
            transaction.type === "income"
            ? "transaction-income"
            : "transaction-expense";


        // Decide + or -
        let sign =
            transaction.type === "income"
            ? "+"
            : "-";


        // Add transaction HTML
        transactionItem.innerHTML = `

            <div class="transaction-info">

                <h6>
                    ${transaction.description}
                </h6>

                <small>
                    ${transaction.type}
                </small>

            </div>


            <div>

                <span class="${amountClass}">

                    ${sign} ₹${transaction.amount
                        .toLocaleString("en-IN")}

                </span>


                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${transaction.id})"
                >
                    🗑️
                </button>

            </div>

        `;


        // Add transaction to page
        transactionList.appendChild(transactionItem);

    });

}


// ========================================
// UPDATE SUMMARY
// ========================================

function updateSummary() {

    // Variables to store totals
    let totalIncome = 0;

    let totalExpense = 0;


    // Loop through all transactions
    transactions.forEach(function(transaction) {

        // Check whether transaction is income
        if (transaction.type === "income") {

            totalIncome += transaction.amount;

        }

        // Otherwise it is an expense
        else {

            totalExpense += transaction.amount;

        }

    });


    // Calculate balance
    let balance = totalIncome - totalExpense;


    // Display total income
    totalIncomeElement.innerText =
        "₹" + totalIncome.toLocaleString("en-IN");


    // Display total expense
    totalExpenseElement.innerText =
        "₹" + totalExpense.toLocaleString("en-IN");


    // Display balance
    balanceElement.innerText =
        "₹" + balance.toLocaleString("en-IN");

}


// ========================================
// DELETE TRANSACTION
// ========================================

function deleteTransaction(id) {

    // Remove selected transaction
    transactions = transactions.filter(
        function(transaction) {

            return transaction.id !== id;

        }
    );


    // Save updated array
    saveTransactions();


    // Display updated transactions
    displayTransactions();


    // Update summary
    updateSummary();

}


// ========================================
// SEARCH TRANSACTIONS
// ========================================

searchInput.addEventListener("input", function() {

    // Get search text
    let searchText =
        searchInput.value.toLowerCase().trim();


    // Filter transactions
    let filteredTransactions =
        transactions.filter(function(transaction) {

            return transaction.description
                .toLowerCase()
                .includes(searchText);

        });


    // Display filtered transactions
    displayTransactions(filteredTransactions);

});


// ========================================
// SAVE TRANSACTIONS
// ========================================

function saveTransactions() {

    // Convert JavaScript array into JSON
    // and save it in browser LocalStorage
    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ========================================
// LOAD DATA WHEN PAGE OPENS
// ========================================

// Display saved transactions
displayTransactions();

// Update income, expense and balance
updateSummary();