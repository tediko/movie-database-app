import renderComponent from '../components/renderComponent';
import { bookmarkManager } from '../database/bookmarkManager';

/**
 * Gets the current URL path.
 * @returns {string} The current URL path.
 */
const getCurrentURL = () => {
    const path = window.location.pathname;
    return path;
}

/**
 * Finds and returns a route that matches the given path.
 * @param {string} path - The URL path to match.
 * @returns {(object|null)} The matched route object if found, null otherwise.
 */
const matchUrlToRoutes = (path) => {
    const matchedRoute = routes.find((route) => route.path === path);
    const route404 = routes.find((route) => route.path === '/404');
    return matchedRoute || route404;
}

/**
 * Loads the initial route based on the current URL path.
 */
const loadInitialRoute = () => {
    const path = getCurrentURL();
    loadRoute(path);
}

/**
 * Loads a route based on the given URL path.
 * @param {string} path - The URL path name
 */
const loadRoute = (path) => {
    const matchedRoute = matchUrlToRoutes(path);

    if (!matchedRoute) {
        throw new Error('Route not found');
    }

    matchedRoute.callback();
}

/**
 * Navigates to the specified path and loads the corresponding route.
 * @param {string} path - The path to navigate to.
 * @param {URL} [url] - An optional URL object representing the new URL to navigate to with query params.
 */
const navigateTo = (path, url) => {
    // Push the new state to the browser's history stack without causing a full page reload.
    window.history.pushState(null, null, url ? url : path);
    bookmarkManager.unsubscribe();
    loadRoute(path);
}

// Listen when the user navigate through the session history using the browser's back or forward buttons.
window.addEventListener('popstate', () => {
    loadInitialRoute();
});

// Defining Routes
const routes = [
    { path: '/app', callback: () => {
        document.title = `MovieDB - Your personal entertainment hub`;
        renderComponent('search');
        renderComponent('trending');
        renderComponent('trailers');
        renderComponent('recommended');
    }},
    { path: '/app/top-rated', callback: () => {
        document.title = `MovieDB - Top rated movies & TV series`
        renderComponent('search');
        renderComponent('top');
    }},
    { path: '/app/bookmarks', callback: () => {
        document.title = `MovieDB - Bookmarked Movies and TV Series`
        renderComponent('search');
        renderComponent('bookmarks');
    }},
    { path: '/app/title', callback: () => {
        renderComponent('mediaDetails');
    }},
    { path: '/404', callback: () => {
        document.title = `MovieDB - 404: Take the cannoli!`
        renderComponent('404');
    }}
]

export const router = {
    getCurrentURL,
    loadInitialRoute,
    navigateTo
};