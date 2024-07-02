import Swiper from 'swiper';
import 'swiper/css';

/**
 * Initialize a Swiper slider instance.
 * @param {string} containerSelector - The CSS selector for the slider container.
 * @param {Object} [options={}] - Custom options to override default Swiper settings.
 * @returns {Swiper|null} The Swiper instance or null if initialization fails.
 */
const initSlider = (containerSelector, options = {}) => {
    const sliderContainer = document.querySelector(containerSelector);

    if (!sliderContainer) {
        console.error(`Slider container not found: ${sliderContainer}`);
        return null;
    }
    // default Swiper options
    const defaultOptions = {
        loop: false,
        slidesPerView: "auto",
        spaceBetween: 24,
        speed: 600,
        centeredSlides: false,
        on: {
            init: (swiper) => {
                // Add data-slide-index attribute to each slide
                swiper.slides.forEach((slide, index) => {
                    slide.setAttribute('data-slide-index', index);
                });
            }
        }
    }
    // Merge default options with custom options
    const sliderOptions = { ...defaultOptions, ...options };

    // Initialize Swiper instance
    const swiper = new Swiper(sliderContainer, sliderOptions);

    // Add event listener for focus events
    // Return if focused element has data-bookmark-cta attribute
    // When user use keyboard to navigate through swiper slides it will 
    // change sliderWrapper transform value to match focused slide
    // and prevent bug where slider is stuck.
    sliderContainer.addEventListener('focusin', (event) => {
        if (event.target.hasAttribute('data-bookmark-cta')) return;

        const focusedElement = event.target.parentElement;

        if (focusedElement) {
            const slideIndex = focusedElement.dataset.slideIndex;
            swiper.slideTo(slideIndex);
        }
    });

    // Return Swiper instance
    return swiper;
};

export default initSlider;