import { fetchTopRated } from '../api/fetchData';
import { getGenres } from '../database';
import { createHtmlElement, createBookmarkHtmlElement, displayDataError, attachBookmarkEventListener } from '../utilities';

// Selectors
let topRatedContainer;
let topRatedPagination;
let topRatedList;
let listOfMediaGenres;

// Flags
const paginationSelector = `[data-top-pagination-wrapper]`;
const containerSelector = `[data-top-wrapper]`;
const listSelector = `[data-top-list]`;
const paginationCtaSelector = `[data-top-page]`;
const selectCtaSelector = `[data-top-select]`;
const smallBackgroundUrl = `https://media.themoviedb.org/t/p/w500/`;
const activeClass = 'active';
let dataTypeToDisplay = 'movie';
let activePage = 1;

/**
 * Initializes top rated content section.
 */
async function initTopRated() {
    topRatedContainer = document.querySelector(containerSelector)
    topRatedList = document.querySelector(listSelector);
    topRatedPagination = document.querySelector(paginationSelector);

    if (!topRatedContainer || !topRatedList) return;
    
    try {
        const data = await fetchTopRated();
        listOfMediaGenres = await getGenres();
        
        displayTopRated(data);
        attachBookmarkEventListener(topRatedList);
        attachEventListeners(topRatedContainer);
    } catch (error) {
        displayDataError(topRatedList);
    }
}

/**
 * Updates top rated content section.
 */
async function updateTopRated(type, page) {
    try {
        const data = await fetchTopRated(type, page);
        
        displayTopRated(data);
    } catch (error) {
        displayDataError(topRatedList);
    }
}

/**
 * Displays a list of top rated movies or TVseries in the DOM.
 * @param {Array} data - An array of data object containing movie or TVseries information
 */
const displayTopRated = (data) => {
    // Creates a document Fragment to build the list
    const fragment = new DocumentFragment();

    data.forEach(({ id, title, backdropPath, type, releaseData, ratingAverage, genreIds }) => {
        const releaseYear = releaseData.split('-')[0];
        const userRating = +(ratingAverage).toFixed(2);
        // Create a formatted string of genre names, and filter/remove any undefined values from the resulting array.
        const genres = genreIds
            .slice(0, 2)
            .map(id => listOfMediaGenres.find(genre => genre.id === id)?.name)
            .filter(Boolean)
            .join(', ');

        const listItem = createHtmlElement('li', ['media-showcase__item'], `
            <a href="/title?${id}" class="media-showcase__item-cta" data-top-cta style="background-image: url('${smallBackgroundUrl}${backdropPath}')">
                <div class="media-showcase__details">
                    <p class="media-showcase__details-desc fs-200 fw-400 text-white75">
                        <span>${releaseYear}</span>
                        <span class="media-showcase__details-genre">${genres}</span>
                    </p>
                    <h3 class="media-showcase__details-title fs-450 fw-500 text-white">${title}</h3>
                </div>
                    <p class="media-showcase__user-rating fs-300 fw-700 text-white">
                        ${userRating}
                    </p>
            </a>
            ${createBookmarkHtmlElement({id, title, backdropPath, type, releaseData, genreIds}, 'media-showcase__bookmark-cta')}
        `)

        fragment.appendChild(listItem);
    })

    // Create five pagination buttons since we want to display 5x20 movies/tv series.
    const paginationButtons = Array.from(Array(5).keys()).map((item, index) => {
        const page = index + 1;
        const isActive = page == activePage;
        return isActive ? 
            `<button class="media-showcase__pagination-cta active fs-300 text-white" type="button" aria-label="Page ${page}" data-top-page="${page}">${page}</button>` : 
            `<button class="media-showcase__pagination-cta fs-300 text-white" type="button" aria-label="Page ${page}" data-top-page="${page}">${page}</button>`;
    })

    // Clears the existing content of topRatedList and appends the new fragment.
    // Adds paginationButtons within topRatedPagination container.
    topRatedList.innerHTML = '';
    topRatedList.appendChild(fragment);
    displayPaginationButtons();
}

/**
 * Displays pagination buttons.
 */
function displayPaginationButtons() {
    // Create five pagination buttons since we want to display 5x20 movies/tv series.
    const paginationButtons = Array.from(Array(5).keys()).map((_, index) => {
        const page = index + 1;
        const isActive = page == activePage;
        return isActive ? 
            `<button class="media-showcase__pagination-cta active fs-300 text-white" type="button" aria-label="Page ${page}" data-top-page="${page}">${page}</button>` : 
            `<button class="media-showcase__pagination-cta fs-300 text-white" type="button" aria-label="Page ${page}" data-top-page="${page}">${page}</button>`;
    })

    // Display pagination
    topRatedPagination.innerHTML = paginationButtons.join('');
}

/**
 * Attaches event listeners to a container element for pagination and content type selection.
 * @param {HTMLElement} container - The container element to which the event listeners will be attached.
 */
const attachEventListeners = (container) => {
    // Add a click event listener to the container element
    container.addEventListener('click', (event) => {
        const eventTarget = event.target;
        
        // Pagination: When a pagination cta is clicked, it updates the active page and fetches new data.
        if (eventTarget.hasAttribute(paginationCtaSelector) || eventTarget.closest(paginationCtaSelector)) {
            const targetData = eventTarget.dataset.topPage;
            activePage = targetData;
            updateTopRated(dataTypeToDisplay, targetData);
        }
        
        // Content select: When a content select cta is clicked, it updates the content type,
        // resets the active page to 1, updates the UI, and fetches new data.
        if (eventTarget.hasAttribute(selectCtaSelector) || eventTarget.closest(selectCtaSelector)) {
            const targetData = eventTarget.dataset.topSelect;
            const siblingElement = eventTarget.previousElementSibling || eventTarget.nextElementSibling;
            dataTypeToDisplay = targetData;
            activePage = 1;

            siblingElement.classList.remove(activeClass);
            eventTarget.classList.add(activeClass);
            updateTopRated(targetData, 1);
        }
    })
}

export default initTopRated;