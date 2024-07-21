import { bookmarkManager } from '../database/bookmarkManager';
import { renderApp } from '../components/app';

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
        renderApp('home');
    }},
    { path: '/app/top-rated', callback: () => {
        renderApp('top-rated');
    }},
    { path: '/app/bookmarks', callback: () => {
        renderApp('bookmarks');
    }},
    { path: '/app/title', callback: () => {
        renderApp('title');
    }},
    { path: '/app/profile', callback: () => {
        renderApp('profile');
    }},
    { path: '/404', callback: () => {
        renderApp('404');
    }}
]

export const router = {
    getCurrentURL,
    loadInitialRoute,
    navigateTo
};