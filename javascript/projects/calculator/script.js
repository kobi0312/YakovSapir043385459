document.addEventListener("DOMContentLoaded", function () {
    const output = document.getElementById("output");
    const buttons = document.querySelectorAll("button");

    let currentValue = "0";
    let operator = null;
    let previousValue = null;
    let shouldResetScreen = false;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const type = button.getAttribute("data-type");
            const value = button.value;

            switch (type) {
                case "operand":
                    handleNumber(value);
                    break;
                case "operator":
                    handleOperator(value);
                    break;
                case "clear":
                    clear();
                    break;
                default:
                    break;
            }

            updateOutput();
        });
    });

    const updateOutput = () => {
        output.value = currentValue;
    };

    const handleNumber = (number) => {
        if (currentValue === "0" || shouldResetScreen) {
            currentValue = number;
            shouldResetScreen = false;
        } else {
            currentValue += number;
        }
    };

    const handleOperator = (nextOperator) => {
        if (operator && !shouldResetScreen) {
            calculate();
        }
        previousValue = currentValue;
        operator = nextOperator;
        shouldResetScreen = true;
    };

    const calculate = () => {
        const prev = parseFloat(previousValue);
        const current = parseFloat(currentValue);
        if (isNaN(prev) || isNaN(current)) return;

        switch (operator) {
            case "+":
                currentValue = (prev + current).toString();
                break;
            case "-":
                currentValue = (prev - current).toString();
                break;
            case "*":
                currentValue = (prev * current).toString();
                break;
            case "/":
                currentValue = (prev / current).toString();
                break;
            case "%":
                currentValue = (prev % current).toString();
                break;
            case "invert":
                currentValue = (current * -1).toString();
                break;
            case "=":
                calculate();
                break;
            default:
                break;
        }

        operator = null;
        previousValue = null;
        shouldResetScreen = true;
    };

    const clear = () => {
        currentValue = "0";
        operator = null;
        previousValue = null;
        shouldResetScreen = false;
    };
});
