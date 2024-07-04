import initTrending from './view/displayTrending';
import initRecommended from './view/displayRecommended';
import initTopRated from './view/displayTopRated';
import { bookmarkManager } from './database/bookmarkManager';

async function initApp() {
    const location = window.location.href;
    if (!location.includes('app')) return;

    await bookmarkManager.init();
    initRecommended();
    initTrending();
    initTopRated();
}

export default initApp;