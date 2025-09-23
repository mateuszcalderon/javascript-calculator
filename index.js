// Grab elements from the DOM:
const display = document.getElementById('display')
const history = document.getElementById('history')
const backspaceBtn = document.getElementById('backspace-btn')

// Maximum number of characters allowed in the display expression.
const EXPRESSION_LENGTH = 10

// Initializes '0' on display at the start.
display.value = '0'

function appendToDisplay(input) {
    // Prevents input if maximum expression length is reached.
    if (display.value.length >= EXPRESSION_LENGTH) {
        return
    }

    // Replaces initial '0' with the first input number.
    if (display.value === '0' && !isNaN(input)) {
        display.value = input
    // Replace operator symbols with display-friendly equivalents:
    } else if (input === '/') {
        display.value += '÷'
    } else if (input === '*') {
        display.value += '×'
    } else if (input === '.') {
        display.value += ','
    } else if (input === '%') {
        display.value += '%'
    } else {
        display.value += input
    }

}

// Clears both display and history.
function clearDisplay() {
    display.value = '0'
    history.textContent = ''
}

// Removes last character from display. If display is empty, reset to '0'.
function backspace() {
    display.value = display.value.slice(0, -1)
    if (display.value === '') {
        display.value = '0'
    }
}

/*
 * Backspace button handlers
 * Settings for single click and long press backspace
 */
let backspaceInterval

// Single click backspace:
backspaceBtn.addEventListener('click', backspace)
// Long press backspace:
backspaceBtn.addEventListener('mousedown', () => {
    backspaceInterval = setInterval(backspace, 100)   // Adjusts the backspace for 100ms interval.
})
// Stops deleting when mouse is released or leaves the button area.
backspaceBtn.addEventListener('mouseup', () => {
    clearInterval(backspaceInterval)
})
backspaceBtn.addEventListener('mouseleave', () => {
    clearInterval(backspaceInterval)
})

/*
 * Evaluates the expression in the display
 * Converts display symbols (÷, ×, ,) back to valid JavaScript operators (/, *, .)
 */
function calculate() {
    try {
        // Saves current expression to history.
        history.textContent = display.value

        // Converts display symbols to valid JavaScript operators.
        let expression = display.value
            .replace(/÷/g, '/')
            .replace(/×/g, '*')
            .replace(/,/g, '.')
            .replace(/%/g, '/100')

        // Evaluate, display result and convert dot to comma.
        display.value = eval(expression).toString().replace('.', ',')
    } catch (error) {
        // Error handling for good practices.
        display.value = 'Error.'
    }
}

/*
 * Keyboard handler
 * Handles number keys, operators, Enter (for equals), Backspace, and Escape (for clear)
 */
document.addEventListener('keydown', (event) => {
    const key = event.key

    if (!isNaN(key) || key === ',' || key === '.' || ['+', '-', '*', '/', '%'].includes(key)) {
        appendToDisplay(key === '.' ? ',' : key)
    } else if (key === 'Enter' || key === '=') {
        calculate()
    } else if (key === 'Backspace') {
        backspace()
    } else if (key === 'Escape') {
        clearDisplay()
    }
})