const display = document.getElementById("textbox");
let lastAnswer = "";
let expression = ""; // internal expression for eval()
let justEvaluated = false; // track if last action was "="

// Handle button clicks
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;
    const text = button.innerText;

    // Numbers, decimal, operators, brackets
    if (
      button.classList.contains("number") ||
      button.classList.contains("decimal") ||
      button.classList.contains("operator") ||
      button.classList.contains("open-bracket") ||
      button.classList.contains("close-bracket")
    ) {
      // If just evaluated and user presses a number/decimal → start fresh
      if (justEvaluated && (button.classList.contains("number") || button.classList.contains("decimal"))) {
        display.value = "";
        expression = "";
        justEvaluated = false;
      }

      expression += value;   // store real operator
      display.value += text; // show pretty operator
      justEvaluated = false;
    }

    // Clear all
    else if (button.classList.contains("clear")) {
      display.value = "";
      expression = "";
      justEvaluated = false;
    }

    // Clear last entry (entire number)
    else if (button.classList.contains("clear-entry")) {
      display.value = display.value.replace(/(\d+\.?\d*)$/, "");
      expression = expression.replace(/(\d+\.?\d*)$/, "");
      justEvaluated = false;
    }

    // Backspace
    else if (button.classList.contains("backspace")) {
      display.value = display.value.slice(0, -1);
      expression = expression.slice(0, -1);
      justEvaluated = false;
    }

    // Toggle sign
    else if (button.classList.contains("sign")) {
      if (display.value && expression) {
        if (display.value.startsWith("-")) {
          display.value = display.value.slice(1);
          expression = expression.slice(1);
        } else {
          display.value = "-" + display.value;
          expression = "-" + expression;
        }
      }
      justEvaluated = false;
    }

    // Answer recall
    else if (button.classList.contains("answer")) {
      display.value += lastAnswer;
      expression += lastAnswer;
      justEvaluated = false;
    }

    // Calculate
    else if (button.classList.contains("equals")) {
      try {
        let result = eval(expression);
        display.value = result;
        expression = result.toString();
        lastAnswer = result;
        justEvaluated = true; // mark last action as evaluation
      } catch {
        display.value = "Error";
        expression = "";
        justEvaluated = true;
      }
    }
  });
});

// Optional: Keyboard support
document.addEventListener("keydown", (e) => {
  if (justEvaluated && ((e.key >= "0" && e.key <= "9") || e.key === ".")) {
    // Start fresh if number/decimal pressed after "="
    display.value = "";
    expression = "";
    justEvaluated = false;
  }

  if (e.key >= "0" && e.key <= "9") {
    display.value += e.key;
    expression += e.key;
  } else if (["+", "-", ".", "(", ")"].includes(e.key)) {
    display.value += e.key;
    expression += e.key;
  } else if (e.key === "*") {
    display.value += "×";
    expression += "*";
  } else if (e.key === "/") {
    display.value += "÷";
    expression += "/";
  } else if (e.key === "^") {
    display.value += "^";
    expression += "**";
  } else if (e.key === "Enter") {
    e.preventDefault();
    try {
      let result = eval(expression);
      display.value = result;
      expression = result.toString();
      lastAnswer = result;
      justEvaluated = true;
    } catch {
      display.value = "Error";
      expression = "";
      justEvaluated = false;
    }
  } else if (e.key === "Backspace") {
    display.value = display.value.slice(0, -1);
    expression = expression.slice(0, -1);
  } else if (e.key === "Escape") {
    display.value = "";
    expression = "";
  }
});
