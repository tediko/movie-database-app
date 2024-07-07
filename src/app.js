import initTrending from './view/displayTrending';
import initRecommended from './view/displayRecommended';
import initTopRated from './view/displayTopRated';
import { bookmarkManager } from './database/bookmarkManager';
import initBookmarks from './view/displayBookmarks';
import { getUser, signOut } from './auth/authentication';

async function initApp() {
    const user = await getUser();
    const location = window.location.href;
    
    if (!location.includes('app')) return;
    if (!user) {
        window.location.href = '/access/login.html';
    };

    await bookmarkManager.init();
    initRecommended();
    initTrending();
    initTopRated();
    initBookmarks();
    addLogoutButtonListener();
}

const addLogoutButtonListener = () => {
    const logoutCtaSelector = '[data-logout-cta]';
    const logoutElement = document.querySelector(logoutCtaSelector);

    logoutElement.addEventListener('click', signOut);
}

export default initApp;