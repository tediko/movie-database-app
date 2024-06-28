import { showFormErrorMessage } from "./utilities";

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
        showFormErrorMessage(eventTarget, ['Please enter a valid email address.']);
    }
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