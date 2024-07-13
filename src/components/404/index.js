import { router } from '../../app/router';
import image404 from '../../assets/image404.jpg';
import { updateActiveNavElement } from '../../app';

// Elements
let appRoot;
let wrapperContainer;
let navLink;

// Selectors
const appRootSelector = `#root`;
const wrapperSelector = `[data-404-wrapper]`;
const navLinkSelector = `[data-404-link]`;

/**
 * Initializes 404 section
 */
const init404 = () => {
    appRoot = document.querySelector(appRootSelector);
    wrapperContainer = document.querySelector(wrapperSelector);
    if (!appRoot || !wrapperContainer) return;

    navLink = document.querySelector(navLinkSelector);
    navLink.addEventListener('click', handleNavLinkClick);
}

/**
 * Handles the click event on navigation link
 * @param {Event} event - The click event object.
 */
const handleNavLinkClick = (event) => {
    event.preventDefault();
    appRoot.innerHTML = '';
    router.navigateTo('/app');
    updateActiveNavElement();
}

/**
 * Returns the HTML for the 404 component.
 * @returns {string} The HTML for the 404 component.
 */
const get404Html = () => {
    return `
        <div class="page404__container" data-404-wrapper>
            <p class="page404__quote fs-600 fw-700 text-uc text-white">
                I'm gonna make him an offer he can't refuse.
                <span class="fs-400 text-red">- Vito Corleone</span>
            </p>
            <div class="page404__image-wrapper">
                <img class="page404__image" src="${image404}" alt="">
            </div>
            <h2 class="page404__title fs-500 text-uc text-white">Page not found!</h2>
            <p class="page404__desc fs-400 text-white">It seems this page is sleeping with the fishes. Don't worry, we're not going to the mattresses over this. Why don't you go <a href="/app" class="page404__cta text-dc-none text-blue-light" data-404-link>back to the homepage</a> and enjoy some cannoli?</p>
        </div>`;
}

export { get404Html, init404 };