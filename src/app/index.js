import { bookmarkManager } from '../database/bookmarkManager';
import { getUser, signOut } from '../auth/authentication';
import { router } from './router';

// Elements
let root;
let headerContainer;

// Selectors
const rootSelector = `#root`;
const headerSelector = `[data-header-container]`;
const navLinkSelector = (attrValue) => attrValue ? `[data-link="${attrValue}"]` : `[data-link]`;
const logoutCtaSelector = `[data-logout-cta]`;

// Flags
const activeClass = 'active';

/**
 * Initializes the Application
 */
async function initApp() {
    const user = await getUser();
    root = document.querySelector(rootSelector);
    headerContainer = document.querySelector(headerSelector);
    
    // Check if root element exists.
    if (!root) return;
    
    // Check if there is an existing user session, if not return and redirect to login page.
    if (!user) {
        window.location.href = '/access/login.html';
        return;
    };
    
    // Initializes bookmarks
    await bookmarkManager.init();
    // Triggering the correct route based on the current URL
    router.loadInitialRoute();
    // Set up navigation event listeners
    setupNavigation();
}


/**
 * Sets up the navigation event listeners and handlers.
 */
const setupNavigation = () => {
    headerContainer.addEventListener('click', (event) => {
        const eventTarget = event.target;

        // Handle nav link click
        if (eventTarget.matches(navLinkSelector())) {
            handleNavLinkClick(event)
        }

        // Handle logout button click
        if (eventTarget.matches(logoutCtaSelector)) {
            signOut();
        }
    });
};

/**
 * Updates header active nav link element based on url path by adding active class to it
 * and remove it from the rest.
 */
const updateActiveNavElement = () => {
    const navLinks = headerContainer.querySelectorAll(navLinkSelector());
    const activeNavElement = Array.from(navLinks).find(link => link.matches(navLinkSelector(router.getCurrentURL())));

    navLinks.forEach(link => link.classList.remove(activeClass));
    activeNavElement ? activeNavElement.classList.add(activeClass) : null;
}

/**
 * Handles the click event on navigation link
 * @param {HTMLElement} container - The header container element.
 * @param {Event} event - The click event object.
 */
const handleNavLinkClick = (event) => {
    event.preventDefault();
    const eventTarget = event.target;
    const path = eventTarget.getAttribute('href');

    // Clear root element HTML and route to clicked navLink path.
    root.innerHTML = '';
    router.navigateTo(path);
}

export { initApp, updateActiveNavElement };