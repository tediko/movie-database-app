import { fetchTrending } from "../api/fetchData";
import initSlider from "../slider";
import { createHtmlElement, displayDataError, createBookmarkHtmlElement, attachBookmarkEventListener } from "../utilities";
import { getUserBookmarks, updateUserBookmarks } from "../database";

// Selectors
let trendingList;

// Flags
const posterBackgroundUrl = 'https://image.tmdb.org/t/p/w342/';
const listSelector = '[data-trending-list]';
const swiperSelector = '[data-trending-swiper]';

/**
 * Initializes the trending content section.
 */
async function initTrending() {
    trendingList = document.querySelector(listSelector);

    if (!trendingList) return;

    try {
        const data = await fetchTrending();
        const bookmarks = await getUserBookmarks();

        displayTrending(data, bookmarks);
        attachBookmarkEventListener(trendingList, bookmarks, updateUserBookmarks);
    } catch (error) {
        displayDataError(trendingList);
    }
}

/**
 * Displays a list of trending movies or TVseries in the DOM
 * @param {Array} data - An array of data object containing movie or TVseries information
 * @param {Array<Object>} bookmarks - An array of bookmark objects
 * @param {number} numOfMediaToDisplay - The number of media to display. Defaults to 12.
 */
const displayTrending = (data, bookmarks, numOfMediaToDisplay = 12) => {
    // Slices the data array to the specified number of movies to display
    // and creates a DocumentFragment to build the list.
    const slicedTrendingData = data.slice(0, numOfMediaToDisplay);
    const fragment = new DocumentFragment();

    // Creates a list item for each movie/TVseries with details and appends it to the fragment.
    slicedTrendingData.forEach(({id, title, posterPath, backdropPath, type, releaseData, ratingAverage}) => {
        const releaseYear = releaseData.split('-')[0];
        const mediaType = type === 'movie' ? `<img src="/assets/icon-category-movie.svg" alt=""> Movie` : `<img src="/assets/icon-category-tv.svg" alt=""> TV Series`
        const userRating = +(ratingAverage * 10).toFixed();
        const userRatingDecimal = userRating / 100;

        const listItem = createHtmlElement('li', ['trending__item', 'swiper-slide'], `
            <a href="/title?${id}" class="trending__item-cta" data-trending-cta>
                <div class="trending__item-bg" style="background-image: url('${posterBackgroundUrl}${posterPath}') ">
                    <p class="trending__user-score fs-200 fw-700 text-white" style="--progress: ${userRating}">
                        <label class="sr-only" for="user-rating">User rating: </label>
                        <meter class="sr-only" id="user-rating" value="${userRatingDecimal}">${userRating}%</meter>
                    </p>
                </div>
                <div class="trending__details">
                    <p class="trending__details-desc fs-200 fw-400 text-white75">
                        <span>${releaseYear}</span>
                        <span>${mediaType}</span>
                    </p>
                    <h3 class="trending__details-title fs-400 fw-500 text-white">${title}</h3>
                </div>
            </a>
            ${createBookmarkHtmlElement(bookmarks, {id, title, backdropPath, type, releaseData}, 'trending__bookmark-cta')}
        `);

        fragment.appendChild(listItem);
    })

    // Clears the existing content of trendingList and appends the new fragment.
    // Initializes a slider for the trending movies/TVseries and attaches event listener to list container.
    trendingList.innerHTML = '';
    trendingList.appendChild(fragment);
    initSlider(swiperSelector, {spaceBetween: 32});
}

export default initTrending;