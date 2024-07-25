import { bookmarkManager } from '../database/bookmarkManager';
import { getUser } from '../auth/authentication';
import { router } from './router';

// Elements
let root;

// Selectors
const rootSelector = `#root`;

/**
 * Initializes the Application
 */
async function initApp() {
    root = document.querySelector(rootSelector);
    
    // Check if root element exists.
    if (!root) return;
    const user = await getUser();
    
    // Check if there is an existing user session, if not return and redirect to login page.
    if (!user) {
        window.location.href = '/access/login.html';
        return;
    };
    
    // Initializes bookmarks
    await bookmarkManager.init();
    // Triggering the correct route based on the current URL
    router.loadInitialRoute();
}

export { initApp };