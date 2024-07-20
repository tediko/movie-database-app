import { createHtmlElement } from "../utilities";
import { initBookmarks, getBookmarksHtml } from './bookmarks';
import { initTrending, getTrendingHtml } from "./trending";
import { initTrailers, getTrailersHtml } from "./trailers";
import { initRecommended, getRecommendedHtml } from "./recommended";
import { initTopRated, getTopRatedHtml } from "./topRated";
import { getSearchHtml, initSearch } from "./search";
import { getMediaDetailsHtml, initMediaDetails } from "./mediaDetails";
import { get404Html, init404 } from "./404";
import { getProfileHtml, initProfile } from "./profile";

// Selectors
const rootSelector = `#root`;

/**
 * Renders a component in the root element.
 * @param {string} componentName - The name of the component to render.
 */
const renderComponent = (componentName) => {
    // Check if root element exists.
    const root = document.querySelector(rootSelector);
    if (!root) return;
    
    // Checks if the componentName key exists in the componentTemplates object.
    if (!componentTemplates[componentName]) {
        console.error(`Template for component "${componentName}" not found.`);
        return;
    };
    
    // Gets component HTML string
    const componentTemplate = componentTemplates[componentName].html;
    // Create a new section element with the specified tag and classes
    const componentWrapper = createHtmlElement(componentTemplates[componentName].tag, componentTemplates[componentName].classes, '');
    // Parse the HTML template string into a DocumentFragment
    const fragment = document.createRange().createContextualFragment(componentTemplate);
    
    // Append DocumentFragment to the section element and insert the new view section into the root element.
    componentWrapper.appendChild(fragment);
    root.appendChild(componentWrapper);

    // Initializes component
    componentTemplates[componentName].init();
}

const componentTemplates = {
    search: {
        html: getSearchHtml(),
        tag: 'section',
        classes: ['app__search', 'search'],
        init: initSearch
    },
    bookmarks: {
        html: getBookmarksHtml(),
        tag: 'section',
        classes: ['app__media-showcase', 'media-showcase'],
        init: initBookmarks
    },
    top: {
        html: getTopRatedHtml(),
        tag: 'section',
        classes: ['app__media-showcase', 'media-showcase'],
        init: initTopRated
    },
    trending: {
        html: getTrendingHtml(),
        tag: 'section',
        classes: ['app__trending', 'trending'],
        init: initTrending
    },
    trailers: {
        html: getTrailersHtml(),
        tag: 'section',
        classes: ['app__trailers', 'trailers--small'],
        init: initTrailers
    },
    recommended: {
        html: getRecommendedHtml(),
        tag: 'section',
        classes: ['app__media-showcase', 'media-showcase'],
        init: initRecommended
    },
    mediaDetails: {
        html: getMediaDetailsHtml(),
        tag: 'section',
        classes: ['media-details'],
        init: initMediaDetails
    },
    profile: {
        html: getProfileHtml(),
        tag: 'section',
        classes: ['profile'],
        init: initProfile
    },
    404: {
        html: get404Html(),
        tag: 'section',
        classes: ['page404'],
        init: init404
    }
}

export default renderComponent;