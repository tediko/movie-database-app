import { getGenres } from "../../database"
import { createHtmlElement, createBookmarkHtmlElement, attachBookmarkEventListener, attachLinkWithParamsEventListener } from "../../utilities";
import { fetchMediaDetails } from "../../api/fetchData";
import noImageImg from '../../assets/no-image.jpg';
import initSlider from "../../slider";
import { getUrlQueryParameters } from "../../utilities";
import { router } from "../../app/router";

// Elements
let topWrapper;
let castList;
let similarList;

// Selectors
const topWrapperSelector = `[data-media-details-top-wrapper]`;
const castListSelector = `[data-media-details-cast-list]`;
const castSwiperSelector = `[data-media-details-cast-swiper]`;
const similarListSelector = `[data-media-details-similar-list]`;

// Flags
const bigBackgroundUrl = `https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces`;
const smallBackgroundUrl = `https://media.themoviedb.org/t/p/w500/`;
const profileBackgroundUrl = `https://media.themoviedb.org/t/p/w300_and_h450_bestv2`;
const componentName = 'mediaDetails';
const idQueryParameterName = 'id';
const typeQueryParameterName = 'type';

// State
let listOfMediaGenres;

/**
 * Initializes media details content section.
 */
async function initMediaDetails() {
    const queryParams = { id: getUrlQueryParameters(idQueryParameterName), type: getUrlQueryParameters(typeQueryParameterName) };

    topWrapper = document.querySelector(topWrapperSelector);
    castList = document.querySelector(castListSelector);
    similarList = document.querySelector(similarListSelector);
    
    if (!topWrapper) return;
    if (queryParams.id == null || queryParams.id === '' || queryParams.type == null || queryParams.type === '') {
        router.navigateTo('404');
        return;
    }

    try {
        listOfMediaGenres = await getGenres();
        const data = await fetchMediaDetails(queryParams.type, queryParams.id);

        displayTop(data);
        displayCast(data);
        displaySimilar(data);
    } catch (error) {
        router.navigateTo('404');
    }
}

/**
 * Displays a container with detailed info about movie/tv series in the DOM
 * @param {Array} data - An array of data object containing movie or TVseries information
 */
const displayTop = (data) => {
    const { id, title, backdropPath, type, releaseData, genreIds, runTime, ratingAverage, tagline, overview } = data;
    const releaseYear = releaseData.split('-')[0];
    const releaseDataFormatted = releaseData.split('-').reverse().join('/');
    const mediaType = type === 'movie' ? `<img src="/assets/icon-category-movie.svg" alt=""> Movie` : `<img src="/assets/icon-category-tv.svg" alt=""> TV Series`
    const userRating = +(ratingAverage * 10).toFixed();
    const userRatingDecimal = userRating / 100;
    const genres = genreIds
        .slice(0, 2)
        .map(item => listOfMediaGenres.find(genre => genre.id === item.id)?.name)
        .filter(Boolean)
        .join(', ');
    const runTimeFormatted = type === 'movie' ? `${runTime} min` : `${runTime} seasons`;
    const genreIdsArr = genreIds.map(genre => genre.id);
    
    // Creates a DocumentFragment to build the container
    const fragment = new DocumentFragment();

    // Creates a container movie/TV series with details and appends it to the fragment.
    const topInfoContainer = createHtmlElement('div', ['media-details__top-container'], `
        <h2 class="media-details__title fs-700 fw-700 text-white">${title} <span class="fw-500 text-white50">(${releaseYear})</span></h2>
        <p class="media-details__info fs-200 fw-400 text-white75">
            <span>${releaseDataFormatted}</span>
            <span>${mediaType}</span>
            <span class="media-details__info-genre">${genres}</span>
            <span>${runTimeFormatted}</span>
        </p>
        <p class="media-details__tagline fs-400 fw-300 text-white50">${tagline}</p>
        <p class="media-details__desc fs-400 fw-300 text-white">${overview}</p>
        <div class="media-details__top-details">
            <div class="media-details__top-score">
                <p class="fs-300 fw-700 text-white">User score</p>
                <p class="media-details__user-score user-score fs-200 fw-700 text-white" style="--progress: ${userRating}">
                    <label class="sr-only" for="user-rating">User rating: </label>
                    <meter class="sr-only" id="user-rating" value="${userRatingDecimal}">${userRating}%</meter>
                </p>
            </div>
            ${createBookmarkHtmlElement({id, title, backdropPath, type, releaseData, genreIds: genreIdsArr}, ['media-details__cta', , 'fs-300', 'fw-700', 'text-white'], 'Bookmark')}
        </div>
    `)
    fragment.appendChild(topInfoContainer);

    // Clears the existing content of topWrapper and appends the new fragment.
    // Sets new topWrapper background, change page title and attach event listeners for bookmarks.
    topWrapper.innerHTML = '';
    topWrapper.style.backgroundImage = `url("${bigBackgroundUrl}${backdropPath}")`;
    topWrapper.appendChild(fragment);
    document.title = `${title} (${releaseYear}) - MovieDB`
    attachBookmarkEventListener(topWrapper, componentName);
}

/**
 * Displays a list with cast info in the DOM
 * @param {Array} data - An array of data object containing movie or TVseries information
 */
const displayCast = (data) => {
    if (!castList) return;
    const slicedData = data.cast.slice(0, 10);
    
    // Creates a DocumentFragment to build the list
    const fragment = new DocumentFragment();
    // Creates a list item for each cast member with details and appends it to the fragment.
    slicedData.forEach(({ name, character, known_for_department, profile_path }) => {
        const profileImage = profile_path ? `${profileBackgroundUrl}${profile_path}` : noImageImg;
        const listItem = createHtmlElement('li', ['media-details__cast-item', 'swiper-slide'], `
            <div class="media-details__cast-item-bg" style="background-image: url(${profileImage})"></div>
            <div class="media-details__cast-details">
                <h3 class="media-details__cast-details-title fs-400 fw-500 text-white">${name}</h3>
                <p class="fs-300 fw-300 text-white75">${character}</p>
                <p class="fs-200 fw-300 text-blue-grayish">${known_for_department}</p>
            </div>    
        `);
        fragment.appendChild(listItem);
    })

    // Clears the existing content of castList and appends the new fragment
    // Initializes slider
    castList.innerHTML = '';
    castList.appendChild(fragment);
    initSlider(castSwiperSelector, { spaceBetween: 32 })
}

/**
 * Displays a list of recommended movies or TVseries in the DOM
 * @param {Array} data - An array of data object containing movie or TVseries information
 * @param {number} numOfMediaToDisplay - The number of media to display. Defaults to 8.
 */
const displaySimilar = (data, numOfMediaToDisplay = 8) => {
    if (!similarList) return;
    const filteredData = data.recommendations.filter(item => item.original_language == 'en').slice(0, numOfMediaToDisplay).map(item => {
        return {
            id: item.id,
            title: item.title || item.name,
            backdropPath: item.backdrop_path || '',
            type: data.type,
            releaseData: item.release_date || item.first_air_date || '',
            genreIds: item.genre_ids
        }
    });
    // Creates a DocumentFragment to build the list
    const fragment = new DocumentFragment();
    
    // Creates a list item for each movie and TV series with details and appends it to the fragment.
    filteredData.forEach(({id, title, type, backdropPath, releaseData, genreIds}) => {
        const releaseYear = releaseData.split('-')[0];
        const mediaType = type === 'movie' ? `<img src="/assets/icon-category-movie.svg" alt=""> Movie` : `<img src="/assets/icon-category-tv.svg" alt=""> TV Series`
        const stringifyUrlParams = JSON.stringify({id, type});

        const listItem = createHtmlElement('li', ['media-showcase__item'], `
            <a href="/app/title?id=${id}&type=${type}" class="media-showcase__item-cta" data-params='${stringifyUrlParams}' style="background-image: url('${backdropPath ? `${smallBackgroundUrl}${backdropPath}` : noImageImg}')">
                <div class="media-showcase__details">
                    <p class="media-showcase__details-desc fs-200 fw-400 text-white75">
                    <span>${releaseYear}</span>
                    <span>${mediaType}</span>
                    </p>
                    <h3 class="media-showcase__details-title fs-450 fw-500 text-white">${title}</h3>
                </div>
            </a>
            ${createBookmarkHtmlElement({id, title, backdropPath, type, releaseData, genreIds}, ['media-showcase__bookmark-cta', 'bookmark-cta', 'text-white'])}
            `)
            
            fragment.appendChild(listItem);
        });
        
        // Clears the existing content of trendingList and appends the new fragment.
        // Attaches event listeners.
        similarList.innerHTML = '';
        similarList.appendChild(fragment);
        attachBookmarkEventListener(similarList, componentName);
        attachLinkWithParamsEventListener(similarList);
}

/**
 * Returns the HTML for the media details component.
 * @returns {string} The HTML for the media details.
 */
const getMediaDetailsHtml = () => {
   return `
        <section class="media-details">
            <div class="media-details__container">
                <div class="media-details__top" data-media-details-top-wrapper></div>
                <section class="media-details__cast" data-media-details-cast>
                    <h2 class="media-details__cast-title fs-600 fw-300 text-white">Top billing cast</h2>
                    <div class="media-details__cast-wrapper swiper" data-media-details-cast-swiper>
                        <ul class="media-details__cast-list swiper-wrapper" data-media-details-cast-list>
                            <li class="media-details__cast-shimmer" aria-hiden="true"></li>
                            <li class="media-details__cast-shimmer" aria-hiden="true"></li>
                            <li class="media-details__cast-shimmer" aria-hiden="true"></li>
                            <li class="media-details__cast-shimmer" aria-hiden="true"></li>
                            <li class="media-details__cast-shimmer" aria-hiden="true"></li>
                            <li class="media-details__cast-shimmer" aria-hiden="true"></li>
                            <li class="media-details__cast-shimmer" aria-hiden="true"></li>
                            <li class="media-details__cast-shimmer" aria-hiden="true"></li>
                        </ul>
                    </div>
                </section>
                <section class="media-details__similar media-showcase__container">
                    <h2 class="media-showcase__title fs-600 fw-300 text-white">Similar to watch</h2>
                    <ul class="media-showcase__list" data-media-details-similar-list>
                        <li class="media-showcase__shimmer" aria-hiden="true"></li>
                        <li class="media-showcase__shimmer" aria-hiden="true"></li>
                        <li class="media-showcase__shimmer" aria-hiden="true"></li>
                        <li class="media-showcase__shimmer" aria-hiden="true"></li>
                        <li class="media-showcase__shimmer" aria-hiden="true"></li>
                        <li class="media-showcase__shimmer" aria-hiden="true"></li>
                        <li class="media-showcase__shimmer" aria-hiden="true"></li>
                        <li class="media-showcase__shimmer" aria-hiden="true"></li>
                    </ul>
                </section>
            </div>
        </section>
    ` 
}

export { getMediaDetailsHtml, initMediaDetails };