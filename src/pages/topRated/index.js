import renderComponent from "../../components/renderComponent";

/**
 * Renders the top-rated page.
 * @param {HTMLElement} root - DOM element where the top-rated page components will be rendered
 */
const renderTopRated = (root) => {
    root.innerHTML = '';
    document.title = `MovieDB - Top rated movies & TV series`
    renderComponent('search', root);
    renderComponent('top', root);
}

export { renderTopRated };