import { bookmarkManager } from "./database/bookmarkManager";
import { router } from "./app/router";

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
 * @param {HTMLElement} container - The container element wrapping error messages
 * @param {string[]} messages - An array of error messages to display.
 * @param {Boolean} hasSuccess - Boolean value to display either succes or error message.
 */
const showFormMessage = (container, messages, hasSuccess) => {
    const msgElement = container.querySelector('[data-form-message]');

    // Early return if inputs are invalid or error element doesn't exist
    if (!container || messages.length === 0 || !Array.isArray(messages)) return;
    if (!msgElement) return;

    // Flags
    const activeClass = hasSuccess ? 'has-success' : 'has-error';
    const icon = hasSuccess ? '<i class="fa-solid fa-circle-check" aria-hidden="true"></i>' : '<i class="fa-solid fa-circle-exclamation" aria-hidden="true"></i>';

    // Create HTML string for error messages
    const message = messages
        .map(msg => `<span>${icon} ${msg}</span>`)
        .join('');

    msgElement.innerHTML = message;
    msgElement.classList.add(activeClass);
    msgElement.setAttribute('aria-hidden', 'false');
    
    // Add a one-time event listener to hide the error when user starts typing
    container.addEventListener('input', () => {
        msgElement.classList.remove(activeClass);
        msgElement.setAttribute('aria-hidden', 'true');
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
 * @param {string} elementTag - String containing html tag name.
 * @param {HTMLElement} listContainer - Container HTML element to attach error message.
 */
const displayDataError = (listContainer, elementTag) => {
    const errorElement = createHtmlElement(elementTag, ['data-error'], `
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p class="fs-400 fw-700 text-white">It seems like our data unicorns have gone on strike.<br>Try again later!</p>    
    `);

    listContainer.innerHTML = '';
    listContainer.appendChild(errorElement);
}

/**
 * Creates HTML string for a bookmark button element
 * @param {Object} bookmarkInfo - Object containing information about the item to be bookmarked.
 * @param {String[]} classes - An array of CSS class names to apply to element
 * @returns {string} HTML string representing a bookmark button element.
 */
const createBookmarkHtmlElement = (bookmarkInfo, classes) => {
    const {id, title, type} = bookmarkInfo;
    // Checks if bookmark with given id and type is bookmarked.
    const isBookmarked = bookmarkManager.isBookmarked(id, type);
    // Convert bookmarkInfo object to string and replace all single quotes with the HTML entity &apos;. This prevents the single quotes from breaking the attribute value.
    const stringifiedBookmarkInfo = JSON.stringify(bookmarkInfo).replace(/'/g, "&apos;");
    
    return isBookmarked ? 
        `<button class="${classes.join(' ')}" type="button" aria-label="Remove ${title} from bookmarks" data-bookmark-cta data-bookmarked data-bookmark-info='${stringifiedBookmarkInfo}'></button>` : 
        `<button class="${classes.join(' ')}" type="button" aria-label="Add ${title} to bookmarks" data-bookmark-cta data-bookmark-info='${stringifiedBookmarkInfo}'></button>`;
}

/**
 * Attaches a bookmark event listener to a container element, allowing users to bookmark and unbookmark items.
 * @param {HTMLElement} container - The container element where the bookmark event listener will be attached.
 * @param {'string'} callingComponentName - Name of the calling component.
 */
const attachBookmarkEventListener = (container, callingComponentName) => {
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
            
            bookmarkManager.notifySubscribers(callingComponentName);
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
 * Attaches a click event listener to the specified container to handle navigation with custom parameters.
 * @param {HTMLElement} container - The container element to which the event listener will be attached.
 * @returns {void}
 */
const attachLinkWithParamsEventListener = (container) => {
    const root = document.querySelector('#root');
    const linkWithParamsSelector = `[data-params]`;
    const path = `/app/title`

    if (!root || !container) return;

    container.addEventListener('click', (event) => {
        event.preventDefault();
        const eventTarget = event.target;

        // Check if the event target or its closest ancestor has the data-params attribute
        if (eventTarget.hasAttribute(linkWithParamsSelector) || eventTarget.closest(linkWithParamsSelector)) {
            const parsedData = JSON.parse(event.target.dataset.params);

            router.navigateTo(path, createUrlWithIdAndTypeParams(parsedData, path));
            window.scrollTo(0, 0);
        }
    })
}

/**
 * Creates a new URL object with the provided `id` and `type` parameters and the specified `path`.
 * @param {Object} data - An object containing the `id` and `type` properties.
 * @param {string} path - The path to be set in the URL.
 * @returns {URL} - A new URL object with the specified parameters and path.
 */
const createUrlWithIdAndTypeParams = (data, path) => {
    const url = new URL(location);
    url.searchParams.set('id', data.id);
    url.searchParams.set('type', data.type);
    url.pathname = path;

    return url;
}

/**
 * Generates a random character name from a predefined list of iconic names.
 * @returns {string} A randomly selected character name from the list.
 */
const generateRandomName = () => {
    const names = ['Jack Sparrow', 'Sheldon Cooper', 'Michael Scott', 'Homer Simpson', 'Miss Piggy', 'Marty McFly', 'Winnie the Pooh', 'Hannibal Lecter', 'Rocky Balboa', 'Forrest Gump', 'James Bond', 'Wonder Woman', 'Harley Quinn'];
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
}

export { 
    createHtmlElement,
    focusTrap,
    emailValidation,
    passwordValidation,
    showFormMessage,
    showRedirectSuccessMessage,
    redirectToNewLocation,
    displayDataError,
    createBookmarkHtmlElement,
    attachBookmarkEventListener,
    debounce,
    getUrlQueryParameters,
    attachLinkWithParamsEventListener,
    createUrlWithIdAndTypeParams,
    generateRandomName
};