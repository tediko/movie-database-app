/**
 * Creates an HTML element with the specified tag, classes and content.
 * @param {String} tag - The HTML tag name (e.g 'div', 'p' etc.)
 * @param {String[]} classes - An array of CSS class names to apply to element
 * @param {String} content - The inner HTML content of element
 * @returns {HTMLElement} - The created HTML element
 */
const createHtmlElement = (tag, classes, content) => {
    const element = document.createElement(tag);
    element.classList.add(...classes);
    element.innerHTML = content;
    return element;
}

/**
 * Creates a focus-trap within a specified container element.
 * Ensures that the user's focus remains within that container
 * preventing it moving outside the trap.
 * @param {HTMLElement} container - The container element to create the focus trap within.
 */
const focusTrap = (container) => {
    const focusableElements = container.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    const tabKey = 'Tab';

    container.setAttribute('tabindex', '-1');
    container.focus();

    container.addEventListener('keydown', (event) => {
        const pressedKey = event.key;
        const isTabPressed = pressedKey === tabKey;
        
        if (!isTabPressed) return;
        
        if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus();
            }
        }
    })
}

/**
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {Boolean} - Returns true if the email is valid or false otherwise.
 */
const emailValidation = (email) => {
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
    return emailRegex.test(email);
}

/**
 * Validates a password using a regular expression.
 * @param {string} password - The password to validate.
 * @returns {Boolean} - Returns true if the password is valid or false otherwise.
 */
const passwordValidation = (password) => {
    let requiredPasswordLength = 6;
    return password.length >= requiredPasswordLength;
}

/**
 * Displays error messages in a form and sets up auto-hiding on user input.
 * @param {HTMLElement} formContainer - The container element of the form.
 * @param {string[]} messages - An array of error messages to display.
 */
const showFormErrorMessage = (formContainer, messages) => {
    const errorElement = formContainer.querySelector('[data-form-error]');

    // Early return if inputs are invalid or error element doesn't exist
    if (!formContainer || messages.length === 0 || !Array.isArray(messages)) return;
    if (!errorElement) return;

    // Flags
    const activeClass = 'active';
    const errorIcon = '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>';

    // Create HTML string for error messages
    const errorMsg = messages
        .map(msg => `<span>${errorIcon} ${msg}</span>`)
        .join('');

    errorElement.innerHTML = errorMsg;
    errorElement.classList.add(activeClass);
    errorElement.setAttribute('aria-hidden', 'false');
    
    // Add a one-time event listener to hide the error when user starts typing
    formContainer.addEventListener('input', () => {
        errorElement.classList.remove(activeClass);
        errorElement.setAttribute('aria-hidden', 'true');
    }, { once: true})
}

export { 
    createHtmlElement,
    focusTrap,
    emailValidation,
    passwordValidation,
    showFormErrorMessage
};