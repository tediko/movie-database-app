import { signIn, getUser } from "./authentication";
import { emailValidation, passwordValidation, showFormErrorMessage, showRedirectSuccessMessage, redirectToNewLocation } from "../utilities";

// Flags
const appPageUrl = '/app/index.html';
const loginPageUrl = '/access/login.html';
const loginFormSelector = '[data-access-signin]';
const loginCtaSelector = '[data-login-cta]';
const loginContainerSelector = '[data-access-container]';
const loginTestAccountCtaSelector = '[data-access-test]';

/**
 * Handles form submission, performs validation and initiates login process.
 * @param {Event} event - The submit event object.
 * @param {HTMLElement} loginFormContainer - The form container element.
 */
const handleFormSubmit = (event, loginFormContrainer) => {
    event.preventDefault();

    const emailInputElement = loginFormContrainer.querySelector('input[type="email"]');
    const passwordInputElement = loginFormContrainer.querySelector('input[type="password"]');
    const emailValue = emailInputElement.value;
    const passwordValue = passwordInputElement.value;

    let errors = [];

    if (!emailValidation(emailValue)) {
        errors.push('Invalid email address');
    }

    if (!passwordValidation(passwordValue)) {
        errors.push('Incorrect password (min. 6 characters)');
    }

    if (errors.length > 0) {
        showFormErrorMessage(loginFormContrainer, errors);
        return;
    }

    login(emailValue, passwordValue, loginFormContrainer);
}

/**
 * Authenticates a user using email and password, manages the login process, and handles the outcome.
 * @async
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @param {HTMLElement} loginFormContainer - Container element for the login form.
 * @throws {Error} If the login attempt fails, the error is caught and displayed in the form container.
 * @returns {Promise<void>}
 */
async function login(email, password, loginFormContrainer) {
    try {
        await signIn(email, password);
        showRedirectSuccessMessage(loginContainerSelector, 'You are successfully logged in!')
        redirectToNewLocation(appPageUrl);
    } catch(error) {
        showFormErrorMessage(loginFormContrainer, [`${error.message}`]);
    }
}

/**
 * Middleware function to redirect user to either app page or login page based if there is an existing session or not.
 */
async function loginMiddleware() {
    const user = await getUser();
    if (user) {
        window.location.href = appPageUrl;
    } else {
        window.location.href = loginPageUrl;
    }
}

/**
 * Sets up the login button cta event listener to handle login middleware.
 */
const handleLoginButtonClick = () => {
    const loginButton = document.querySelector(loginCtaSelector);

    if (!loginButton) return;

    loginButton.addEventListener('click', (event) => {
        event.preventDefault();
        loginMiddleware();
    });
}

/**
 * Sets up the test account button cta event listener to handle login to test account
 */
const handleTestAccountLogin = (event, loginFormElement) => {
    event.preventDefault();
    
    // Test account credentials.
    // No need to hide or secure these credentials as they are meant for public use
    const testAccount = {
        email: 'test@example.com',
        password: 'test123'
    }

    login(testAccount.email, testAccount.password, loginFormElement);
}

/**
 * Initializes the login form validation by setting up the submit event listeners.
 */
const initLoginFormValidation = () => {
    const loginFormElement = document.querySelector(loginFormSelector);
    if (!loginFormElement) return;

    const testAccountCta = document.querySelector(loginTestAccountCtaSelector);
    testAccountCta.addEventListener('click', () => handleTestAccountLogin(event, loginFormElement));

    loginFormElement.addEventListener('submit', (event) => handleFormSubmit(event, loginFormElement));
}

export { initLoginFormValidation, handleLoginButtonClick };