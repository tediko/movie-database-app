import { fetchSearchResults } from "../../api/fetchData";
import { getGenres } from "../../database";
import { createHtmlElement, createBookmarkHtmlElement, debounce, attachBookmarkEventListener } from "../../utilities";

// Elements
let wrapperContainer;
let formElement;
let resultsWrapper;

// Selectors
const wrapperSelector = `[data-search-wrapper]`;
const formSelector = `[data-search-form]`;
const resultsWrapperSelector = `[data-search-results-wrapper]`;

// State
let listOfMediaGenres;

// Flags 
const smallBackgroundUrl = `https://media.themoviedb.org/t/p/w500/`;

/**
 * Initializes search section
 */
const initSearch = () => {
    wrapperContainer = document.querySelector(wrapperSelector);
    formElement = document.querySelector(formSelector);
    resultsWrapper = document.querySelector(resultsWrapperSelector);

    if (!wrapperContainer) return;

    formElement.addEventListener('submit', (event) => event.preventDefault());
    formElement.addEventListener('input', debounce(handleSearchForm, 800));
    attachBookmarkEventListener(resultsWrapper);
}

/**
 * Handles the search form input event.
 * @param {Event} event - The input event object.
 * @returns {void}
 */
const handleSearchForm = (event) => {
    event.preventDefault();
    const searchQuery = event.target.value;

    if (searchQuery === '' || searchQuery.length < 3) {
        resultsWrapper.innerHTML = '';
        return;
    };

    getSearchResults(searchQuery);
}

/**
 * Fetches and displays search results for a given query.
 * Displays error message when there is fetch problem.
 * @async
 * @param {string} searchQuery - The search query string.
 */
async function getSearchResults(searchQuery) {
    try {
        const data = await fetchSearchResults(searchQuery);
        listOfMediaGenres = await getGenres();

        displaySearchResults(data, searchQuery);
    } catch (error) {
        // TODO: Rework error handling and use displayError fn from utilities
        const errorDiv = createHtmlElement('div', ['data-error'], `
            <i class="fa-solid fa-triangle-exclamation"></i>
            <p class="fs-400 fw-700 text-white">It seems like our data unicorns have gone on strike.<br>Try again later!</p>    
        `);
        resultsWrapper.appendChild(errorDiv);
    }
}

/**
 * Displays search results
 * @param {Object[]} data - The array of items to display.
 * @param {string} searchQuery - The search query that produced these results.
 * @param {number} [numOfMediaToDisplay=12] - The number of items to display. Default is 12.
 */
const displaySearchResults = (data, searchQuery, numOfMediaToDisplay = 12) => {
    const slicedData = data.slice(0, numOfMediaToDisplay);
    const fragment = new DocumentFragment();

    // Create the main elements for the search results
    const resultsList = createHtmlElement('ul', ['search__list', 'media-showcase__list']);
    const resultsTitle = createHtmlElement('h2', ['search__title', 'fs-600', 'fw-300', 'text-white']);
    const separator = createHtmlElement('div', ['separator']);
    
    // Creates a list item for each search result with details and appends it to the fragment.
    slicedData.forEach(({ id, title, backdropPath, type, releaseData, ratingAverage, genreIds }) => {
        const releaseYear = releaseData ? releaseData.split('-')[0] : 'N/A';
        const userRating = +(ratingAverage).toFixed(2);
        const mediaType = type === 'movie' ? `<img src="/assets/icon-category-movie.svg" alt=""> Movie` : `<img src="/assets/icon-category-tv.svg" alt=""> TV Series`;    
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
                        <span>${mediaType}</span>
                        <span class="media-showcase__details-genre">${genres === '' || undefined ? 'N/A' : genres}</span>
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
        
        // Changes results title content
        resultsTitle.innerHTML = `Found ${slicedData.length} ${slicedData.length > 1 ? 'results' : 'result'} for '${searchQuery}'`;
        // Clears the existing content of resultsList and resultsWrapper and appends the new elements to them.
        resultsList.innerHTML = '';
        resultsWrapper.innerHTML = '';
        resultsList.appendChild(fragment);
        resultsWrapper.appendChild(resultsTitle);
        resultsWrapper.appendChild(resultsList);
        resultsWrapper.appendChild(separator);
    }
    
/**
 * Returns the HTML for the search component.
 * @returns {HTMLElement} The HTML for the search component.
 */
const getSearchHtml = () => {
    return `
        <div class="search__container" data-search-wrapper>
            <form action="#" class="search__form" autocomplete="off" data-search-form>
                <button class="search__submit fs-450 text-white" type="submit" aria-label="Search"></button>
                <label class="sr-only" for="search">Search for movies or TV Series</label>
                <input class="search__input fs-450 fw-300 text-white" type="text" name="search" id="search" placeholder="Search for movies or TV Series">
            </form>
            <div class="search__results" aria-live="polite" aria-atomic="true" data-search-results-wrapper></div>
        </div>
    `;
}

export { initSearch, getSearchHtml };