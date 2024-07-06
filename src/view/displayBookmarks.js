import { bookmarkManager } from "../database/bookmarkManager";
import { getGenres } from "../database";
import { createHtmlElement, createBookmarkHtmlElement, displayDataError, attachBookmarkEventListener } from "../utilities";

// Selectors
const containerSelector = `[data-bookmarks-wrapper]`;
const paginationSelector = `[data-bookmarks-pagination-wrapper]`;
const listSelector = `[data-bookmarks-list]`;
const paginationCtaSelector = `[data-bookmarks-page]`;
const selectSelector = `[data-bookmarks-select]`;
const bookmarkCtaAttribute = `data-bookmark-cta`;

// Elements
let bookmarksContainer;
let bookmarksPagination;
let bookmarksList;
let listOfMediaGenres;

// Flags
const smallBackgroundUrl = `https://media.themoviedb.org/t/p/w500/`;
const activeClass = 'active';

// State
let dataTypeToDisplay = 'movie';
let activePage = 0;

/**
 * Initializes bookmarked content section.
 */
async function initBookmarks() {
    bookmarksContainer = document.querySelector(containerSelector);
    bookmarksPagination = document.querySelector(paginationSelector);
    bookmarksList = document.querySelector(listSelector);
    
    if (!bookmarksContainer || !bookmarksList) return; 
    
    try {
        listOfMediaGenres = await getGenres();

        updateBookmarks();
        attachBookmarkEventListener(bookmarksList);
        attachEventListeners(bookmarksContainer);
    } catch (error) {
        displayDataError(bookmarksList);
    }
}

/**
 * Updates and displays bookmarks based on the current page and media type.
 * @param {number} [numOfMediaToDisplay=12] - The number of media items to display per page.
 */
function updateBookmarks(numOfMediaToDisplay = 12) {
    const data = bookmarkManager.getBookmarks();
    // Filter data based on dataTypeToDisplay. Returns either bookmarked movies or tv series.
    const filteredData = data.filter(item => item.type === dataTypeToDisplay);
    // Calculate the total number of pages
    const pagesToDisplay = Math.ceil((filteredData.length / numOfMediaToDisplay));
    // Adjust activePage if it exceeds the available pages
    activePage = Math.min(activePage, pagesToDisplay - 1);

    // Calculate the slice of data to display on the current page
    const currentPageData = filteredData.slice(
        parseInt(activePage) * numOfMediaToDisplay,
        (parseInt(activePage) + 1) * numOfMediaToDisplay
    );
    
    displayBookmarks(currentPageData, pagesToDisplay);
}

/**
 * Displays bookmarks and pagination based on the provided data.
 * @param {Array} data - An array of bookmark objects to display.
 * @param {number} pagesToDisplay - The total number of pages to display in pagination.
 */
const displayBookmarks = (data, pagesToDisplay) => {
    // Creates a document Fragment to build the list.
    const fragment = new DocumentFragment();

    data.forEach(({ id, title, backdropPath, type, releaseData, genreIds }) => {
        const releaseYear = releaseData.split('-')[0];
        // Create formated string of genre names, filter/remove any undefined values from the resulting array.
        const genres = genreIds
            .slice(0, 2)
            .map(id => listOfMediaGenres.find(genre => genre.id === id)?.name)
            .filter(Boolean)
            .join(', ');
        
        const listItem = createHtmlElement('li', ['media-showcase__item'], `
            <a href="/title?${id}" class="media-showcase__item-cta" style="background-image: url('${smallBackgroundUrl}${backdropPath}')">
                <div class="media-showcase__details">
                    <p class="media-showcase__details-desc fs-200 fw-400 text-white75">
                        <span>${releaseYear}</span>
                        <span class="media-showcase__details-genre">${genres}</span>
                    </p>
                    <h3 class="media-showcase__details-title fs-450 fw-500 text-white">${title}</h3>
                </div>
            </a>
            ${createBookmarkHtmlElement({id, title, backdropPath, type, releaseData, genreIds}, 'media-showcase__bookmark-cta')}
        `);

        fragment.appendChild(listItem);
    })

    bookmarksList.innerHTML = '';
    bookmarksList.appendChild(fragment);
    displayPaginationButtons(pagesToDisplay);
}

/**
 * Displays or hides pagination buttons based on the number of pages.
 * @param {number} pagesToDisplay - The total number of pages to be displayed.
 */
function displayPaginationButtons(pagesToDisplay) {
    if (pagesToDisplay > 1) {
        const paginationButtons = Array.from(Array(pagesToDisplay).keys()).map((item, index) => {
            // Check if the current button corresponds to the active page
            const isActive = index == activePage;
            // Calculate the page number (1-based index for display)
            const pageIndex = index + 1;
            return isActive ? 
            `<button class="media-showcase__pagination-cta active fs-300 text-white" type="button" aria-label="Page ${pageIndex}" data-bookmarks-page="${index}">${pageIndex}</button>` : 
            `<button class="media-showcase__pagination-cta fs-300 text-white" type="button" aria-label="Page ${pageIndex}" data-bookmarks-page="${index}">${pageIndex}</button>`;
        })
        
        // Display pagination
        bookmarksPagination.setAttribute('aria-hidden', false);
        bookmarksPagination.innerHTML = paginationButtons.join('');
    } else {
        // Hide pagination if there is only one page
        bookmarksPagination.innerHTML = '';
        bookmarksPagination.setAttribute('aria-hidden', true);
    }
}

/**
 * Attaches event listeners to a container element for bookmark cta, pagination and content type selection.
 * @param {HTMLElement} container - The container element to which the event listeners will be attached.
 */
const attachEventListeners = (container) => {
    // Add a click event listener to the container element
    container.addEventListener('click', (event) => {
        const eventTarget = event.target;
        
        // Handle bookmark removal
        if (eventTarget.hasAttribute(bookmarkCtaAttribute)) {
            updateBookmarks();
        }

        // Handle pagination: When a pagination cta is clicked, it updates the active page and fetches new data.
        if (eventTarget.hasAttribute(paginationCtaSelector) || eventTarget.closest(paginationCtaSelector)) {
            const targetData = eventTarget.dataset.bookmarksPage;
            activePage = targetData;
            updateBookmarks();
        }

        // Handle select: When a content select cta is clicked, it updates the content type,
        // resets the active page to 0, updates the UI, and fetches new data.
        if (eventTarget.hasAttribute(selectSelector) || eventTarget.closest(selectSelector)) {
            const targetData = eventTarget.dataset.bookmarksSelect;
            const siblingElement = eventTarget.previousElementSibling || eventTarget.nextElementSibling;
            dataTypeToDisplay = targetData;
            activePage = 0;

            siblingElement.classList.remove(activeClass);
            eventTarget.classList.add(activeClass);
            updateBookmarks();
        }
    })
}

export default initBookmarks;