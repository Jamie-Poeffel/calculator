let delbutton = "AC";
let storeval = "";
let calcval = "0";
let expression = "";
let lastValidValue = "0";
let currentOperator = "";
let waitingForSecondOperand = false;

document.getElementById("delbutton").innerText = delbutton;

function updateDisplay() {
  document.getElementById("calcval").innerText = calcval;
  document.getElementById("storeval").innerText = storeval;
}

// Berechnung ausführen
function OnEqualClicked() {
  try {
    if (calcval !== "Error" && expression) {
      let result = calculate(expression, calcval, currentOperator);
      storeval = `${expression} ${calcval}`;
      calcval = parseFloat(result).toString();
      expression = "";
      currentOperator = "";
      waitingForSecondOperand = false;
      UpdateACButton(0);
    }
  } catch (e) {
    calcval = "Error";
  }
  updateDisplay();
}

// Punkt hinzufügen
function OnDotClicked() {
  if (!calcval.includes(".")) {
    calcval += ".";
  }
  updateDisplay();
}

// Operator klicken
function OnOperatorClicked(operator) {
  if (calcval === "Error") return;

  if (waitingForSecondOperand) {
    currentOperator = operator;
    return;
  }

  if (!expression) {
    expression = calcval;
  } else if (currentOperator) {
    expression = calculate(expression, calcval, currentOperator);
  }

  currentOperator = operator;
  waitingForSecondOperand = true;
  expression += ` ${operator}`;
  calcval = "0";
  updateDisplay();
}

// Berechnung durchführen
function calculate(firstOperand, secondOperand, operator) {
  firstOperand = parseFloat(firstOperand);
  secondOperand = parseFloat(secondOperand);

  switch (operator) {
    case "+":
      return firstOperand + secondOperand;
    case "−":
      return firstOperand - secondOperand;
    case "×":
      return firstOperand * secondOperand;
    case "÷":
      return secondOperand === 0
        ? "Error"
        : (firstOperand / secondOperand).toFixed(8).substring(0, 10);
    case "%":
      return (firstOperand * secondOperand) / 100;
    default:
      return secondOperand;
  }
}

// AC/⌫ Button aktualisieren
function UpdateACButton(isn) {
  delbutton = isn === 1 ? "⌫" : "AC";
  document.getElementById("delbutton").innerText = delbutton;
}

// Löschen
function OnACCLick() {
  if (delbutton === "⌫") {
    calcval = calcval === "Error" ? lastValidValue : calcval.slice(0, -1);
    if (calcval.length === 0) {
      calcval = "0";
      UpdateACButton(0);
    }
  } else {
    calcval = "0";
    storeval = "";
    expression = "";
    currentOperator = "";
    waitingForSecondOperand = false;
  }
  updateDisplay();
}

// +/- Button klicken
function OnPlusMinusClick() {
  if (calcval !== "0") {
    calcval = calcval.startsWith("-") ? calcval.slice(1) : `-${calcval}`;
  }
  updateDisplay();
}

// Prozent-Berechnung
function OnProcentClicked() {
  if (calcval !== "0" && calcval !== "Error") {
    calcval = calculate(expression || "0", calcval, "%");
  }
  updateDisplay();
}

// Zahlen eingeben
function OnNumberClicked(number) {
  if (calcval === "0" || calcval === "Error") {
    calcval = number.toString();
    UpdateACButton(1);
  } else {
    calcval += number.toString();
  }
  waitingForSecondOperand = false;
  updateDisplay();
}
