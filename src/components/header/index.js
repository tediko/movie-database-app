import { signOut } from '../../auth/authentication';
import { getRandomMedia } from '../../database';
import { createUrlWithIdAndTypeParams } from '../../utilities';
import { router } from '../../app/router';

// Elements
let headerContainer;

// Selectors
const headerContainerSelector = `[data-header-container]`;
const navLinkSelector = (attrValue) => attrValue ? `[data-link="${attrValue}"]` : `[data-link]`;
const logoutCtaSelector = `[data-logout-cta]`;

// Flags
const activeClass = 'active';
const titlePageAttribute = '/app/title';

/**
 * Initializes the header component
 */
async function initHeader() {
    headerContainer = document.querySelector(headerContainerSelector);
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
    console.log('navclick', eventTarget);

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

/**
 * Returns the HTML for the header component.
 * @returns {string} The HTML for the header component.
 */
const getHeaderHtml = () => {
    return `
        <div class="app-header__container" data-header-container>
            <a href="/app" class="app-header__logo-cta" aria-label="MovieDB - Your personal entertainment hub" data-header-logo data-link="/app">
                <img src="/assets/logo.svg" alt="" class="app-header__logo">
            </a>
            <nav class="app-header__nav">
                <ul class="app-header__list">
                    <li class="app-header__item">
                        <a href="/app" class="app-header__link app-header__link--home fs-450 text-dc-none text-blue-grayish" aria-label="MovieDB - Home Page" data-link="/app"></a>
                    </li>
                    <li class="app-header__item">
                        <a href="/app/top-rated" class="app-header__link app-header__link--top fs-450 text-dc-none text-blue-grayish" aria-label="MovieDB - Top rated" data-link="/app/top-rated"></a>
                    </li>
                    <li class="app-header__item">
                        <a href="/app/bookmarks" class="app-header__link app-header__link--bookmarks fs-450 text-dc-none text-blue-grayish" aria-label="MovieDB - Bookmarks" data-link="/app/bookmarks"></a>
                    </li>
                    <li class="app-header__item">
                        <a href="/app/title" class="app-header__link app-header__link--title fs-450 text-dc-none text-blue-grayish" aria-label="MovieDB - Randomly draw a title" data-link="/app/title"></a>
                    </li>
                </ul>
            </nav>
            <div class="app-header__profile">
                <a href="/app/profile" class="app-header__profile-cta" aria-label="Profile settings" data-link="/app/profile">
                    <img class="app-header__profile-image" src="/assets/image-avatar.png" alt="">
                </a>
                <button type="button" class="app-header__logout-cta fs-450 text-blue-grayish" aria-label="Logout from app" data-logout-cta></button>
            </div>
        </div>
    `
}

export { initHeader, getHeaderHtml, updateActiveNavElement };