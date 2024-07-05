import { fetchRecommendations } from "../api/fetchData";
import { createHtmlElement, displayDataError, createBookmarkHtmlElement, attachBookmarkEventListener } from "../utilities";

// Selectors
let recommendedList;

// Flags
const listSelector = '[data-recommended-list]';
const smallBackgroundUrl = `https://media.themoviedb.org/t/p/w500/`;

/**
 * Initializes the recommended content section.
 */
async function initRecommended() {
    recommendedList = document.querySelector(listSelector);

    if (!recommendedList) return;

    try {
        const data = await fetchRecommendations();

        displayRecommended(data);
        attachBookmarkEventListener(recommendedList);
    } catch (error) {
        displayDataError(recommendedList);
    }
}

/**
 * Displays a list of recommended movies or TVseries in the DOM
 * @param {Array} data - An array of data object containing movie or TVseries information
 * @param {number} numOfMediaToDisplay - The number of media to display. Defaults to 12.
 */
const displayRecommended = (data, numOfMediaToDisplay = 12) => {
    // Creates a DocumentFragment to build the list
    const fragment = new DocumentFragment();
    const combinedRecommendations = [];

    // Combine movie and TV series recommendations into a single array.
    // This way the container will have movie item and tv series item alternately
    for (let i = 0; i < (numOfMediaToDisplay / 2); i++) {
        if (data.movies[i]) {
            combinedRecommendations.push(data.movies[i]);
        };
        if (data.tv_series[i]) {
            combinedRecommendations.push(data.tv_series[i])
        };
    }

    // Creates a list item for each movie and TV series with details and appends it to the fragment.
    combinedRecommendations.forEach(({id, title, backdropPath, type, releaseData, genreIds}) => {
        const releaseYear = releaseData.split('-')[0];
        const mediaType = type === 'movie' ? `<img src="/assets/icon-category-movie.svg" alt=""> Movie` : `<img src="/assets/icon-category-tv.svg" alt=""> TV Series`

        const listItem = createHtmlElement('li', ['media-showcase__item'], `
            <a href="/title?${id}" class="media-showcase__item-cta" data-recommended-cta style="background-image: url('${smallBackgroundUrl}${backdropPath}')">
                <div class="media-showcase__more text-white"></div>
                <div class="media-showcase__details">
                    <p class="media-showcase__details-desc fs-200 fw-400 text-white75">
                        <span>${releaseYear}</span>
                        <span>${mediaType}</span>
                    </p>
                    <h3 class="media-showcase__details-title fs-450 fw-500 text-white">${title}</h3>
                </div>
            </a>
            ${createBookmarkHtmlElement({id, title, backdropPath, type, releaseData, genreIds}, 'media-showcase__bookmark-cta')}
        `)

        fragment.appendChild(listItem);
    });

    // Clears the existing content of trendingList and appends the new fragment.
    recommendedList.innerHTML = '';
    recommendedList.appendChild(fragment);
}

export default initRecommended;