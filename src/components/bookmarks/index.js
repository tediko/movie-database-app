import { bookmarkManager } from "../../database/bookmarkManager";
import { getGenres } from "../../database";
import { createHtmlElement, createBookmarkHtmlElement, displayDataError, attachBookmarkEventListener, attachLinkWithParamsEventListener } from "../../utilities";
import noImageImg from '../../assets/no-image.jpg';
import noBookmarkImg from '../../assets/no-bookmark.jpg';

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
const componentName = 'bookmarks';

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
        attachBookmarkEventListener(bookmarksList, componentName);
        attachEventListeners(bookmarksContainer);
        attachLinkWithParamsEventListener(bookmarksList);
        bookmarkManager.subscribe(updateBookmarks, componentName);
    } catch (error) {
        displayDataError(bookmarksList, 'li');
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
    activePage = Math.max(0, Math.min(activePage, pagesToDisplay - 1));

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
        const stringifyUrlParams = JSON.stringify({id, type});
        
        const listItem = createHtmlElement('li', ['media-showcase__item'], `
            <a href="/app/title?id=${id}&type=${type}" class="media-showcase__item-cta" data-params='${stringifyUrlParams}' style="background-image: url('${backdropPath ? `${smallBackgroundUrl}${backdropPath}` : noImageImg}')">
                <div class="media-showcase__details">
                    <p class="media-showcase__details-desc fs-200 fw-400 text-white75">
                        <span>${releaseYear}</span>
                        <span class="media-showcase__details-genre">${genres}</span>
                    </p>
                    <h3 class="media-showcase__details-title fs-450 fw-500 text-white">${title}</h3>
                </div>
            </a>
            ${createBookmarkHtmlElement({id, title, backdropPath, type, releaseData, genreIds}, ['media-showcase__bookmark-cta', 'bookmark-cta', 'text-white'])}
        `);

        fragment.appendChild(listItem);
    })

    // If there is no bookmarked items in array display info message
    if (data.length == 0) {
        renderInfoMessage(fragment);
    }

    bookmarksList.innerHTML = '';
    bookmarksList.appendChild(fragment);
    displayPaginationButtons(pagesToDisplay);
}

/**
 * Renders info message when there are no bookmarks to display.
 * @param {DocumentFragment} fragment - The document fragment to append the created list item to.
 * @returns {DocumentFragment} The document fragment with the appended list item.
 */
const renderInfoMessage = (fragment) => {
    const contentTypeText = dataTypeToDisplay === 'movie' ? 'movies' : 'TV series';
    const listItem = createHtmlElement('li', ['media-showcase__item-bookmarks-info'], `
        <div class="image-wrapper">
            <img src="${noBookmarkImg}" alt="">
        </div>
        <h3 class="fs-500 text-blue-grayish">Add bookmarks!</h3>
        <p class="fs-400 text-white">Don't let the Man in Black's neuralyzer get the best of you! Bookmark your favourite ${contentTypeText} so you can recall them in an instant!</p>
    `);

    return fragment.appendChild(listItem);
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

/**
 * Returns the HTML for the bookmarks component.
 * @returns {string} The HTML for the bookmarks component.
 */
const getBookmarksHtml = () => {
    return `
        <div class="media-showcase__container--grid" data-bookmarks-wrapper>
            <div class="media-showcase__title-wrapper">
                <h2 class="media-showcase__title media-showcase__title--bookmarked fs-600 fw-400 text-white text-uc">Bookmarks</h2>
                <div class="media-showcase__select">
                    <button class="media-showcase__select-cta active fs-300 text-white" type="button" aria-label="Sort by movies" data-bookmarks-select="movie">Movies</button>
                    <button class="media-showcase__select-cta fs-300 text-white" type="button" aria-label="Sort by TV series" data-bookmarks-select="tv">TV Series</button>
                </div>
            </div>
            <ul class="media-showcase__list" data-bookmarks-list>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
                <li class="media-showcase__shimmer" aria-hiden="true"></li>
            </ul>
            <nav class="media-showcase__pagination" data-bookmarks-pagination-wrapper aria-label="Pagination"></nav>
        </div>`;
}

export { initBookmarks, getBookmarksHtml };