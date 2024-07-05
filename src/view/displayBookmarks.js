import { bookmarkManager } from "../database/bookmarkManager";
import { getGenres } from "../database";
import { createHtmlElement, createBookmarkHtmlElement, displayDataError, attachBookmarkEventListener } from "../utilities";

// Selectors
let bookmarksContainer;
let bookmarksPagination;
let bookmarksList;
let listOfMediaGenres;

// Flags
const containerSelector = `[data-bookmarks-wrapper]`;
const paginationSelector = `[data-bookmarks-pagination-wrapper]`;
const listSelector = `[data-bookmarks-list]`;
const paginationCtaSelector = `[data-bookmarks-pagination-cta]`;
const selectSelector = `[data-bookmarks-select]`;
const smallBackgroundUrl = `https://media.themoviedb.org/t/p/w500/`;
const activeClass = 'active';
let dataTypeToDisplay = 'movie'; // remove if unnecessary
let activePage = 1; // remove if unnecessary

async function initBookmarks() {
    bookmarksContainer = document.querySelector(containerSelector);
    bookmarksPagination = document.querySelector(paginationSelector);
    bookmarksList = document.querySelector(listSelector);

    if (!bookmarksContainer || !bookmarksList) return; 

    try {
        const data = bookmarkManager.getBookmarks();
        listOfMediaGenres = await getGenres();

        displayBookmarks(data);
        console.log(data, listOfMediaGenres);
        // attachBookmarkEventListener(bookmarksList);
        // attachEventListeners(bookmarksContainer);
    } catch (error) {
        displayDataError(bookmarksList);
    }
}

export default initBookmarks;