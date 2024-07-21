import renderComponent from "../../components/renderComponent";

/**
 * Renders the 404 page.
 * @param {HTMLElement} root - DOM element where the 404 page components will be rendered
 */
const render404 = (root) => {
    root.innerHTML = '';
    document.title = `MovieDB - 404: Take the cannoli!`
    renderComponent('404', root);
}

export { render404 };