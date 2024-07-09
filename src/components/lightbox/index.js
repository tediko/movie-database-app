import { fetchTrailerSrcKey } from '../../api/fetchData';
import { createHtmlElement, focusTrap } from "../../utilities";

// Selectors
const lightboxElement = document.querySelector('[data-lightbox]');
const overlayElement = document.querySelector('[data-overlay]');
const bodyElement = document.querySelector('body');

// Vars
let lastFocusedEl;

// Flags
const activeClass = 'active';
const youtubeUrl = 'https://www.youtube.com/embed/';


/**
 * Fetches a movie trailer source key and displays lightbox with trailer video.
 * If an error occurs, it displays an appropriate error message in the lightbox.
 * @param {number} targetMovieId - The ID of the movie to fetch the trailer for.
 * @param {Object} trailerData - Additional data about the trailer or movie to be used in the lightbox.
 * @param {HTMLElement} lastFocusedElement - Last focused HTML element node.
 */
async function fetchTrailerAndDisplayLightbox(targetMovieId, trailerData, lastFocusedElement) {
    lastFocusedEl = lastFocusedElement;
    try {
        const trailerSrcKey = await fetchTrailerSrcKey(targetMovieId);
        displayLightbox(trailerData, trailerSrcKey);
    } catch (error) {
        if (error.message.includes('No trailer found')) {
            displayLightboxError(trailerData, 'No trailer available for this movie');
        } else {
            displayLightboxError(trailerData, 'There was a problem connecting to the server');
        }
    }
}

/**
 * Displays lightbox with information about movie trailer
 * @param {Object} trailerData - Additional data about the trailer or movie.
 * @param {number} srcKey - Trailer video source key
 */
const displayLightbox = (trailerData, srcKey) => {
    if (!lightboxElement) return;

    const { title } = trailerData;

    const containerElement = createHtmlElement('div', ['lightbox__container', 'container'], `
        <div class="lightbox__top">
          <h2 class="lightbox__title fs-450 fw-300 text-white">${title}</h2>
          <button class="lightbox__close-cta" aria-label="Close trailer lightbox" data-lightbox-close>
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="lightbox__video">
          <iframe src="${youtubeUrl}${srcKey}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen data-lightbox-iframe></iframe>
        </div>
        <a href="https://www.youtube.com/watch?v=${srcKey}" target="_blank" class="lightbox__cta fs-200 fw-300 text-white">Source: YouTube</a>
    `);
    
    showLightbox(containerElement);
}

/**
 * Displays a lightbox with an error message when a trailer cannot be loaded.
 * @param {Object} trailerData - Additional data about the trailer or movie.
 * @param {string} errorMsg - Error message
 */
const displayLightboxError = (trailerData, errorMsg) => {
    if (!lightboxElement) return;

    const { title } = trailerData;

    const containerElement = createHtmlElement('div', ['lightbox__container', 'container'], `
        <div class="lightbox__top">
          <h2 class="lightbox__title fs-450 fw-300 text-white">${title}</h2>
          <button class="lightbox__close-cta" aria-label="Close trailer lightbox" data-lightbox-close>
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>
        <div class="lightbox__error">
          <i class="fa-solid fa-triangle-exclamation"></i>
          <p class="fs-400 fw-300 text-white">${errorMsg}</p>
        </div>
    `);

    showLightbox(containerElement);
}

/**
 * Displays the lightbox with the provided content.
 * @param {HTMLElement} containerElement - The container element for the lightbox content.
 */
const showLightbox = (containerElement) => {
    const fragment = new DocumentFragment();

    lightboxElement.innerHTML = '';
    fragment.appendChild(containerElement);
    lightboxElement.appendChild(fragment);

    lightboxElement.classList.add(activeClass);
    overlayElement.classList.add(activeClass);

    // Prevents scrolling on the page by fixing the body element in place.
    bodyElement.style.top = `-${window.scrollY}px`;
    bodyElement.style.position = 'fixed';
    bodyElement.style.width = '100%';
    
    attachListeners();
    focusTrap(lightboxElement);
}

/**
 * Hides the lightbox and restores page to its normal state.
 */
const hideLightbox = () => {
    lightboxElement.classList.remove(activeClass);
    overlayElement.classList.remove(activeClass);
    lastFocusedEl.focus();

    // Restores scrolling on the page by removing the fixed position from the body element.
    const scrollY = bodyElement.style.top;
    bodyElement.style.position = '';
    bodyElement.style.top = '';
    window.scrollTo(0, parseInt(scrollY) * -1);
}
/**
 * Attaches event listeners to handle closing the lightbox.
 */
const attachListeners = () => {
    const closeButton = lightboxElement.querySelector('[data-lightbox-close]');

    closeButton.addEventListener('click', function closeLightbox() {
        hideLightbox();
        closeButton.removeEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', function closeLightboxKey(event) {
        const pressedKey = event.key;

        if (pressedKey === 'Escape') {
            hideLightbox();
            closeButton.removeEventListener('keydown', closeLightboxKey);
        }
    })
}

export default fetchTrailerAndDisplayLightbox;