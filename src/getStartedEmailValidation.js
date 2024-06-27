// Flags
const activeClass = 'active';

/**
 * Handles form submission and email validation.
 * @param {Event} event - The submit event object
 */
const handleValidationOnSubmit = (event) => {
    event.preventDefault();
    
    const eventTarget = event.target;
    const inputElement = eventTarget.querySelector('input');
    const inputValue = inputElement.value.trim().toLowerCase();

    if (emailValidation(inputValue)) {
        window.location.href = `access/register.html?email=${inputValue}`;
    } else {
        showErrorMessage(eventTarget, inputElement);
    }
}

/**
 * Displays error message for invalid email input and sets up event listener to hide it when user
 * starts typing within input. 
 * @param {HTMLElement} container - The container element where error message is located.
 * @param {HTMLElement} inputElement - The input element associated with the error.
 */
const showErrorMessage = (container, inputElement) => {
    const errorElement = container.querySelector('[data-home-signup-error]');

    errorElement.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Please enter a valid email address`;
    errorElement.classList.add(activeClass);
    errorElement.setAttribute('aria-hidden', 'false');
    
    inputElement.addEventListener('input', () => {
        errorElement.classList.remove(activeClass);
        errorElement.setAttribute('aria-hidden', 'true');
    }, { once: true})
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
 * Initializes email validation for "get started" form.
 * @param {string} formSelector - Selector for the form element
 */
const initGetStartedEmailValidation = (formSelector) => {
    const formElement = document.querySelector(formSelector);

    if (!formElement) return;

    formElement.addEventListener('submit', handleValidationOnSubmit);
}

export default initGetStartedEmailValidation;