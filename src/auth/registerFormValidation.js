import { signUp } from "./authentication";
import { emailValidation, passwordValidation, showFormErrorMessage, showRedirectSuccessMessage, redirectToNewLocation } from "../utilities";

// Flags
const loginPageUrl = '/access/login.html';
const registerFormSelector = '[data-access-signup]';
const registerContainerSelector = '[data-access-container]';
const emailQueryParameter = 'email';

/**
 * Handles form submission, performs validation and initiates sign-up process.
 * @param {Event} event - The submit event object.
 * @param {HTMLElement} registerFormContainer - The register form container element.
 */
const handleFormSubmit = (event, registerFormContainer) => {
    event.preventDefault();

    const emailInputElement = registerFormContainer.querySelector('input[type="email"]');
    const passwordInputElement = registerFormContainer.querySelectorAll('input[type="password"]');
    const emailValue = emailInputElement.value;
    const passwordValue = passwordInputElement[0].value;
    const secondPasswordValue = passwordInputElement[1].value;

    let errors = [];

    if (!emailValidation(emailValue)) {
        errors.push('Invalid email address');
    }

    if (!passwordValidation(passwordValue) || !passwordValidation(secondPasswordValue)) {
        errors.push('Incorrect password (min. 6 characters)');
    }

    if (passwordValue !== secondPasswordValue) {
        errors.push('Passwords must be the same');
    }

    if (errors.length > 0) {
        showFormErrorMessage(registerFormContainer, errors);
        return;
    }

    register(emailValue, passwordValue, registerFormContainer);
}

/**
 * Creates a new user using email and password, manages the sign-up process, and handles the outcome.
 * @async
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @param {HTMLElement} registerFormContainer - Container element for the login form.
 * @throws {Error} If the sign-up attempt fails, the error is caught and displayed in the form container.
 */
async function register(email, password, registerFormContainer) {
    try {
        await signUp(email, password);
        showRedirectSuccessMessage(registerContainerSelector, `Congratulations! You've successfully signed up!`)
        redirectToNewLocation(loginPageUrl);
    } catch(error) {
        // A little workaround since there are no error codes with sign-up supabase auth.
        // Returns string after colon in error message (e.g. "AuthApiError: error message"); 
        const errorMsg = error.message.split(':')[1];
        showFormErrorMessage(registerFormContainer, [`${errorMsg}`]);
    }
}

/**
 * Retrieves the value of a specified query parameter from the current URL.
 * from the query string of a URL.
 * @param {string} name - The name of the query parameter to retrieve.
 * @returns {string|null} The value of the specified query parameter, or null if not found.
 */
const getUrlQueryParameters = (name) => {
    const newParams = new URLSearchParams(window.location.search);
    return newParams.get(name);
}

/**
 * Initializes the registration form validation and pre-fills the email field if provided in URL.
 */
const initRegisterFormValidation = () => {
    const registerFormElement = document.querySelector(registerFormSelector);
    if (!registerFormElement) return;

    const searchParam = getUrlQueryParameters(emailQueryParameter);
    if (searchParam) {
        const emailInputElement = registerFormElement.querySelector('input[type="email"]');
        emailInputElement.value = searchParam;
    }

    registerFormElement.addEventListener('submit', (event) => handleFormSubmit(event, registerFormElement));
}

export { initRegisterFormValidation };