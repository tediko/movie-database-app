import { bookmarkManager } from "./database/bookmarkManager";

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

/**
 * Displays a redirect success message in a specified container.
 * @param {string} msgContainerSelector - CSS selector for the message container element.
 * @param {string} message - The success message to display. 
 */
const showRedirectSuccessMessage = (msgContainerSelector, message) => {
    const msgContainerEl = document.querySelector(msgContainerSelector);

    // Early return if container element or message doesn't exists
    if (!msgContainerEl || !message) return;

    // Flags
    const activeClass = 'active';
    const successIcon = '<i class="fa-solid fa-check" aria-hidden="true"></i>';

    // Create HTML string for success message
    const successMsg = `
    <p class="access__success-msg fs-400 fw-300 text-white">
        ${successIcon}
        ${message}
        <span class="fs-300">Please wait while redirecting...</span>
    </p>
    `

    msgContainerEl.innerHTML = successMsg;
    msgContainerEl.classList.add(activeClass);
}

/**
 * Redirects the user to the specified page after a specified delay.
 * @param {string} newLocationUrl - The string with new location url.
 * @param {number} [timeoutDuration=1000] - The delay in milliseconds before redirecting. Defaults to 1000ms.
 */
const redirectToNewLocation = (newLocationUrl, timeoutDuration = 1000) => {
    setTimeout(() => {
        window.location.href = newLocationUrl;
    }, timeoutDuration)
}

/**
 * Displays a error in the DOM within list container.
 */
const displayDataError = (listContainer) => {
    const fragment = new DocumentFragment();

    const listItem = createHtmlElement('li', ['data-error'], `
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p class="fs-400 fw-700 text-white">It seems like our data unicorns have gone on strike.<br>Try again later!</p>    
    `);

    listContainer.innerHTML = '';
    fragment.appendChild(listItem);
    listContainer.appendChild(fragment);
}

/**
 * Creates HTML string for a bookmark button element
 * @param {Object} bookmarkInfo - Object containing information about the item to be bookmarked.
 * @param {string} htmlClass - String with name of html class for button element.
 * @returns {string} HTML string representing a bookmark button element.
 */
const createBookmarkHtmlElement = (bookmarkInfo, htmlClass) => {
    const {id, title, type} = bookmarkInfo;
    // Checks if bookmark with given id and type is bookmarked.
    const isBookmarked = bookmarkManager.isBookmarked(id, type);
    // Convert bookmarkInfo object to string and replace all single quotes with the HTML entity &apos;. This prevents the single quotes from breaking the attribute value.
    const stringifiedBookmarkInfo = JSON.stringify(bookmarkInfo).replace(/'/g, "&apos;");
    
    return isBookmarked ? 
        `<button class="${htmlClass} bookmark-cta text-white" type="button" aria-label="Remove ${title} from bookmarks" data-bookmark-cta data-bookmarked data-bookmark-info='${stringifiedBookmarkInfo}'></button>` : 
        `<button class="${htmlClass} bookmark-cta text-white" type="button" aria-label="Add ${title} to bookmarks" data-bookmark-cta data-bookmark-info='${stringifiedBookmarkInfo}'></button>`;
}

/**
 * Attaches a bookmark event listener to a container element, allowing users to bookmark and unbookmark items.
 * @param {HTMLElement} container - The container element where the bookmark event listener will be attached.
 */
const attachBookmarkEventListener = (container) => {
    const bookmarkCtaSelector = '[data-bookmark-cta]';
    const bookmarkCtaAttribute = 'data-bookmark-cta';
    const bookmarkedAttribute = 'data-bookmarked';

    // Toggles the bookmark state of an item.
    const toggleBookmark = (eventTarget) => {
        const { title } = JSON.parse(eventTarget.dataset.bookmarkInfo);
        const bookmark = JSON.parse(eventTarget.dataset.bookmarkInfo);
        const isBookmarked = eventTarget.hasAttribute(bookmarkedAttribute);

        // Updates bookmarks by either add new bookmark if it doesn't exist or remove if it does.
        bookmarkManager.toggleBookmark(bookmark);

        if (isBookmarked) {
            removeBookmark(eventTarget, title);
        } else {
            addBookmark(eventTarget, title);
        }

    }

    // Removes bookmark styles and the bookmarked attribute from the event target and update the aria-label.
    const removeBookmark = (eventTarget, title) => {
        eventTarget.removeAttribute(bookmarkedAttribute);
        eventTarget.setAttribute('aria-label', `Add ${title} to bookmarks`);
    }

    // Adds bookmark styles and sets the bookmarked attribute to the event target and update the aria-label.
    const addBookmark = (eventTarget, title) => {
        eventTarget.setAttribute(bookmarkedAttribute, "");
        eventTarget.setAttribute('aria-label', `Remove ${title} from bookmarks`);
    }

    // Add a click event listener to the container element
    container.addEventListener('click', (event) => {
        const eventTarget = event.target;
        
        // Check if the event target or its closest ancestor has the bookmark CTA attribute
        if (eventTarget.hasAttribute(bookmarkCtaAttribute) || eventTarget.closest(bookmarkCtaSelector)) {
            toggleBookmark(eventTarget);
        }
    })
}

/**
 * Debounce function. Puts a pause on the function execution until a certain amount of time has passed.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {Function} A new debounced function.
 */
function debounce(func, delay) {
    let debounceTimer;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
    }
}

export { 
    createHtmlElement,
    focusTrap,
    emailValidation,
    passwordValidation,
    showFormErrorMessage,
    showRedirectSuccessMessage,
    redirectToNewLocation,
    displayDataError,
    createBookmarkHtmlElement,
    attachBookmarkEventListener,
    debounce
};