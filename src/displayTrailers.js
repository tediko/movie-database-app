import fetchTrailerAndDisplayLightbox from './displayLightbox';
import initSlider from './slider';
import { createHtmlElement } from './utilities';

// Selectors
const trailersWrapper = document.querySelector('[data-trailers-wrapper]');
const trailersList = document.querySelector('[data-trailers-list]');

// Flags
const smallBackgroundUrl = `https://media.themoviedb.org/t/p/w355_and_h200_multi_faces`;
const bigBackgroundUrl = `https://media.themoviedb.org/t/p/original/`;

/**
 * Displays a list of movie trailers in the DOM.
 * @param {Array} moviesList - An array of movie objects containing trailer information.
 * @param {number} [numOfMoviesToDisplay=10] - The number of movies to display. Defaults to 10.
 */
const displayTrailers = (moviesList, numOfMoviesToDisplay = 10) => {
    if (!trailersWrapper || !trailersList) return;

    // Slices the moviesList to the specified number of movies to display
    // and creates a DocumentFragment to build the list.
    const slicedMoviesList = moviesList.slice(0, numOfMoviesToDisplay);
    const fragment = new DocumentFragment();

    // For each movie, creates a list item with movie details and appends it to the fragment.
    slicedMoviesList.forEach(({id, title, background, releaseDate}) => {
        const listItem = createHtmlElement('li', ['home-trailers__item', 'swiper-slide'],
            `
            <a href="#" class="home-trailers__cta" data-trailers-cta data-trailers-bg="${background}" data-trailers-id="${id}" data-trailers-title="${title}">
                <div class="home-trailers__trailer-preview">
                    <img src="${smallBackgroundUrl}${background}" alt="${title}">
                    <div class="home-trailers__play">
                        <img src="/assets/icon-play-simple.svg" alt="">
                    </div>
                </div>
                <h3 class="home-trailers__trailer-title fs-400 fw-500 text-white">${title}</h3>
                <p class="home-trailers__trailer-desc fs-200 fw-400 text-white">Release date: ${releaseDate}</p>
            </a>
            `
        );

        fragment.appendChild(listItem);
    })
    
    // Clears the existing content of trailersList and appends the new fragment.
    // Sets the background image of trailersWrapper to the first movie's background.
    // Initializes a slider for the trailers and attaches event listeners to the trailer list items.
    trailersList.innerHTML = '';
    trailersList.appendChild(fragment);
    trailersWrapper.style.backgroundImage = `url('${bigBackgroundUrl}${moviesList[0].background}')`;
    initSlider('[data-trailers-swiper]');
    attachTrailersListItemListeners(moviesList, trailersList);
}

/**
 * Displays a error in the DOM within trailersList list element.
 */
const displayTrailersErrors = () => {
    const fragment = new DocumentFragment();

    const listItem = createHtmlElement('li', ['home-trailers__error'], `
        <i class="fa-solid fa-triangle-exclamation"></i>
        <p class="fs-400 fw-700 text-white">It seems like our data unicorns have gone on strike.<br>Try again later!</p>    
    `);

    trailersList.innerHTML = '';
    fragment.appendChild(listItem);
    trailersList.appendChild(fragment);
}

/**
 * Handles the hover event for a trailer item. Updates the background image of 
 * the trailersWrapper based on the hovered item's data attribute.
 * @param {HTMLElement} element - The DOM element being hovered over.
 */
const handleTrailersItemHover = (element) => {
    let itemBgImage = element.dataset.trailersBg;
    trailersWrapper.style.backgroundImage = `url('${bigBackgroundUrl}${itemBgImage}')`;
}

/**
 * Handles the click event for a trailer item.
 * @param {Array<Movie>} - An array of movie objects containing trailer information
 * @param {Event} event - The click event object
 */
const handleTrailersItemClick = (moviesList, event) => {
    event.preventDefault();

    // Retrieves the movie ID from the clicked element's data attribute
    // Finds the corresponding movie data from the moviesList.
    let eventTarget = event.currentTarget;
    let targetMovieId = +eventTarget.dataset.trailersId;
    let trailerData = moviesList.find(movie => movie.id == targetMovieId);

    // Displays the lightbox with the trailer data and fetched source key.
    fetchTrailerAndDisplayLightbox(targetMovieId, trailerData, eventTarget);
}

/**
 * Attaches event listeners to trailer list items.
 * @param {Array<Movie>} moviesList - An array of movie objects containing trailer information.
 * @param {HTMLElement} trailersListElement - The DOM element containing the list of trailers.
 */
const attachTrailersListItemListeners = (moviesList, trailersListElement) => {
    const sliderItemCtas = trailersListElement.querySelectorAll('[data-trailers-cta]');

    sliderItemCtas.forEach(item => {
        item.addEventListener('mouseenter', () => {
            handleTrailersItemHover(item)
        });
        item.addEventListener('focus', () => {
            handleTrailersItemHover(item)
        });
        item.addEventListener('click', (event) => {
            handleTrailersItemClick(moviesList, event);
        });
    })
}

export { displayTrailersErrors, displayTrailers };