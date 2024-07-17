import { bookmarkManager } from '../database/bookmarkManager';
import { getUser, signOut } from '../auth/authentication';
import { router } from './router';
import { getRandomMedia } from '../database';
import { createUrlWithIdAndTypeParams } from '../utilities';

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
const titlePageAttribute = '/app/title';

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
    const logoSelector = `[data-header-logo]`;
    const navLinks = headerContainer.querySelectorAll(navLinkSelector());
    const activeNavElement = Array.from(navLinks).find(link => !link.matches(logoSelector) && link.matches(navLinkSelector(router.getCurrentURL())));

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

    // Check if the target element matches the title navlink selector.
    if (eventTarget.matches(navLinkSelector(titlePageAttribute))) {
        // Navigate to a random media item.
        navigateToRandomMedia();
    } else {
        // Route to clicked navLink path.
        router.navigateTo(path);
    }
}

/**
 * Asynchronously retrieves a random media item (movie or tv series),
 * creates a URL with the media ID and type, and navigates to the title page using the created URL.
 */
async function navigateToRandomMedia() {
    const data = await getRandomMedia();
    router.navigateTo(titlePageAttribute, createUrlWithIdAndTypeParams(data, titlePageAttribute));
}

export { initApp, updateActiveNavElement };