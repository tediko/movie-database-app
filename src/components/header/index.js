import { getUser, signOut } from '../../auth/authentication';
import { getRandomMedia, downloadAvatar } from '../../database';
import { createUrlWithIdAndTypeParams, loadImageFromBlob } from '../../utilities';
import { router } from '../../app/router';

// Elements
let headerContainer;

// Selectors
const headerContainerSelector = `[data-header-container]`;
const navLinkSelector = (attrValue) => attrValue ? `[data-link="${attrValue}"]` : `[data-link]`;
const logoutCtaSelector = `[data-logout-cta]`;
const avatarImageSelector = `[data-header-avatar]`;

// Flags
const activeClass = 'active';
const titlePageAttribute = '/app/title';

/**
 * Initializes the header component
 */
async function initHeader() {
    headerContainer = document.querySelector(headerContainerSelector);
    const { id: userId } = await getUser();
    const avatar = await downloadAvatar(userId);
    
    updateHeaderAvatar(avatar);
    setupNavigation();
}

/**
 * Updates the avatar image in the header based on the provided avatar blob.
 * @param {string|Blob} avatar - Base64 string or Blob object representing the avatar image.
 */
const updateHeaderAvatar = (avatar) => {
    const avatarElement = headerContainer.querySelector(avatarImageSelector);

    if (avatar && avatar instanceof Blob) {
        loadImageFromBlob(avatar, avatarElement);
    } else {
        avatarElement.src = avatar;
    }
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
            window.location.href = '/index.html';
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

/**
 * Returns the HTML for the header component.
 * @returns {string} The HTML for the header component.
 */
const getHeaderHtml = () => {
    return `
        <div class="header__container" data-header-container>
            <a href="/app" class="header__logo-cta" aria-label="MovieDB - Your personal entertainment hub" data-header-logo data-link="/app">
                <img src="/assets/logo.svg" alt="" class="header__logo">
            </a>
            <nav class="header__nav">
                <ul class="header__list">
                    <li class="header__item">
                        <a href="/app" class="header__link header__link--home fs-450 text-dc-none text-blue-grayish" aria-label="Home Page" data-link="/app"></a>
                    </li>
                    <li class="header__item">
                        <a href="/app/top-rated" class="header__link header__link--top fs-450 text-dc-none text-blue-grayish" aria-label="Top Rated" data-link="/app/top-rated"></a>
                    </li>
                    <li class="header__item">
                        <a href="/app/bookmarks" class="header__link header__link--bookmarks fs-450 text-dc-none text-blue-grayish" aria-label="Bookmarks" data-link="/app/bookmarks"></a>
                    </li>
                    <li class="header__item">
                        <a href="/app/title" class="header__link header__link--title fs-450 text-dc-none text-blue-grayish" aria-label="Randomly draw a title" data-link="/app/title"></a>
                    </li>
                </ul>
            </nav>
            <div class="header__profile">
                <a href="/app/profile" class="header__profile-cta" aria-label="Profile settings" data-link="/app/profile">
                    <img class="header__profile-image" src="" alt="" data-header-avatar>
                </a>
                <button type="button" class="header__logout-cta fs-450 text-blue-grayish" aria-label="Logout from app" data-logout-cta></button>
            </div>
        </div>
    `
}

export { initHeader, getHeaderHtml, updateActiveNavElement, updateHeaderAvatar };