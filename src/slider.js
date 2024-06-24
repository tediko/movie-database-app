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
    }
    // Merge default options with custom options
    const sliderOptions = { ...defaultOptions, ...options };

    // Initialize and return the Swiper instance
    return new Swiper(sliderContainer, sliderOptions);
};

export default initSlider;