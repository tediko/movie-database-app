import renderComponent from '../components/renderComponent';

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
    return matchedRoute || null;
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
 */
const navigateTo = (path) => {
    // Push the new state to the browser's history stack without causing a full page reload.
    window.history.pushState(null, null, path);
    loadRoute(path);
}

// Listen when the user navigate through the session history using the browser's back or forward buttons.
window.addEventListener('popstate', () => {
    loadInitialRoute();
});

// Defining Routes
const routes = [
    { path: '/app', callback: () => {
        console.log('App')
        document.title = `MovieDB - Your personal entertainment hub`;
        renderComponent('trending');
        renderComponent('trailers');
        renderComponent('recommended');
    }},
    { path: '/app/top-rated', callback: () => {
        console.log('top-rated');
        document.title = `MovieDB - Top rated movies & TV series`
        renderComponent('top');
    }},
    { path: '/app/bookmarks', callback: () => {
        console.log('bookmarks');
        document.title = `MovieDB - Bookmarked Movies and TV Series`
        renderComponent('bookmarks');
    }}
]

export const router = {
    loadInitialRoute,
    navigateTo
};