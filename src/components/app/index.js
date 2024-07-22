import { renderHome } from "../../pages/home";
import { renderTopRated } from "../../pages/topRated";
import { renderBookmarks } from "../../pages/bookmarks";
import { renderTitle } from "../../pages/title";
import { renderProfile } from "../../pages/profile";
import { render404 } from "../../pages/404";
import renderComponent from "../renderComponent";
import { updateActiveNavElement } from "../header";

// Elements
let root;
let appRoot;
let appWrapper;

// Selectors
const rootSelector = `#root`;
const appRootSelector = `[data-app-root]`;
const appWrapperSelector = `[data-app-wrapper]`;

// Flags
let isInitialized = false;

/**
 * Renders the app component and switches page to render the appropriate content.
 * @param {string} pageName - The name of the page to switch to.
 */
const renderApp = (pageName) => {
    root = document.querySelector(rootSelector);
    if (!root) return;

    initApp();
    pageSwitch(pageName);
}

/**
 * Initializes the app component
 */
const initApp = () => {
    if (isInitialized) return;

    // Parse the app component html string into a DocumentFragment
    const fragment = document.createRange().createContextualFragment(getAppHtml());
    root.appendChild(fragment);
    
    appRoot = document.querySelector(appRootSelector);
    appWrapper = document.querySelector(appWrapperSelector);

    renderComponent('header', appWrapper, true);
    isInitialized = true;
}

/**
 * Switches between different pages and renders the appropriate content.
 * @param {string} pageName - The name of the page to switch to.
 */
const pageSwitch = (pageName) => {
    const pages = {
        'home': () => renderHome(appRoot),
        'top-rated': () => renderTopRated(appRoot),
        'bookmarks': () => renderBookmarks(appRoot),
        'title': () => renderTitle(appRoot),
        'profile': () => renderProfile(appRoot),
        '404': () => render404(appRoot)
    }

    const renderPage = pages[pageName] || pages['404'];
    renderPage();
    updateActiveNavElement();
}

/**
 * Returns the HTML for the app component.
 * @returns {string} The HTML for the app component.
 */
const getAppHtml = () => {
    return `
        <div class="app__wrapper" data-app-wrapper>
            <main class="app__main">
                <h1 class="sr-only">MovieDB - Your personal entertainment hub</h1>
                <div class="app__content" data-app-root></div>
            </main>
        </div>
    `
}

export { renderApp, getAppHtml };