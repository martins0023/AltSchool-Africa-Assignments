const display = document.getElementById("display");
const historyContent = document.getElementById("history-content");
const buttons = document.querySelectorAll(".calc-button");

let currentExpression = "";
let history = [];
const MAX_HISTORY_ITEMS = 5; // Limit the number of history items

// Function to update the display
function updateDisplay(value) {
  display.textContent = value;
}

// Function to add item to history
function addHistoryItem(expression, result) {
  // Remove "No history yet." message if present
  const noHistoryMessage = historyContent.querySelector("p.text-gray-400");
  if (noHistoryMessage) {
    historyContent.removeChild(noHistoryMessage);
  }

  const historyItem = document.createElement("div");
  historyItem.classList.add("history-item");
  historyItem.innerHTML = `<span class="expression">${expression}</span><span class="result">= ${result}</span>`;
  historyContent.prepend(historyItem); // Add to the top of the history

  // Keep only the last MAX_HISTORY_ITEMS
  while (historyContent.children.length > MAX_HISTORY_ITEMS) {
    historyContent.removeChild(historyContent.lastChild);
  }
}

// Function to handle button clicks
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    if (value === "C") {
      currentExpression = "";
      updateDisplay("0");
    } else if (value === "backspace") {
      currentExpression = currentExpression.slice(0, -1);
      if (currentExpression === "") {
        updateDisplay("0");
      } else {
        updateDisplay(currentExpression);
      }
    } else if (value === "=") {
      try {
        // Replace '×' with '*' and '÷' with '/' for evaluation
        let expressionToEvaluate = currentExpression
          .replace(/×/g, "*")
          .replace(/÷/g, "/")
          .replace(/\^/g, "**"); // Replace ^ with ** for power

        // Evaluate the expression
        let result = eval(expressionToEvaluate);

        // Handle potential floating point inaccuracies for display
        if (
          Number.isFinite(result) &&
          Math.abs(result) < 1e-9 &&
          result !== 0
        ) {
          result = 0; // Treat very small numbers close to zero as zero
        }

        // Check if result is NaN or Infinity (e.g., division by zero)
        if (isNaN(result) || !isFinite(result)) {
          throw new Error("Cannot divide by zero or invalid operation");
        }

        addHistoryItem(currentExpression, result); // Add to history
        currentExpression = String(result); // Set result as new expression
        updateDisplay(result);
      } catch (error) {
        updateDisplay("Error");
        currentExpression = ""; // Clear expression on error
        console.error("Calculation error:", error);
      }
    } else {
      // Prevent multiple leading zeros
      if (currentExpression === "0" && value !== ".") {
        currentExpression = value;
      } else {
        currentExpression += value;
      }
      updateDisplay(currentExpression);
    }
  });
});

// Handle keyboard input
document.addEventListener("keydown", (event) => {
  const key = event.key;

  // Map keyboard keys to calculator actions
  if (key >= "0" && key <= "9") {
    document.querySelector(`.calc-button[data-value="${key}"]`).click();
  } else if (key === ".") {
    document.querySelector(`.calc-button[data-value="."`).click();
  } else if (key === "+" || key === "-" || key === "/") {
    document.querySelector(`.calc-button[data-value="${key}"]`).click();
  } else if (key === "*") {
    document.querySelector(`.calc-button[data-value="*"]`).click(); // Map * to ×
  } else if (key === "Enter") {
    event.preventDefault(); // Prevent default Enter key behavior (e.g., form submission)
    document.querySelector(`.calc-button[data-value="="]`).click();
  } else if (key === "Escape" || key === "c" || key === "C") {
    document.querySelector(`.calc-button[data-value="C"]`).click();
  } else if (key === "Backspace") {
    document.querySelector(`.calc-button[data-value="backspace"]`).click();
  } else if (key === "%") {
    document.querySelector(`.calc-button[data-value="^"]`).click(); // Map % to ^ (power)
  }
});

// Initial display setup
updateDisplay("0");
