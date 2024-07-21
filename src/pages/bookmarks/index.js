import renderComponent from "../../components/renderComponent";

/**
 * Renders the bookmarks page.
 * @param {HTMLElement} root - DOM element where the bookmarks page components will be rendered
 */
const renderBookmarks = (root) => {
    root.innerHTML = '';
    document.title = `MovieDB - Bookmarked Movies and TV Series`
    renderComponent('search', root);
    renderComponent('bookmarks', root);
}

export { renderBookmarks };