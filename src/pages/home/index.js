import renderComponent from "../../components/renderComponent";

/**
 * Renders the home page.
 * @param {HTMLElement} root - DOM element where the home page components will be rendered
 */
const renderHome = (root) => {
    root.innerHTML = '';
    document.title = `MovieDB - Your personal entertainment hub`;
    renderComponent('search', root);
    renderComponent('trending', root);
    renderComponent('trailers', root);
    renderComponent('recommended', root);
}

export { renderHome };