import renderComponent from "../../components/renderComponent";

/**
 * Renders the title page.
 * @param {HTMLElement} root - DOM element where the title page components will be rendered
 */
const renderTitle = (root) => {
    root.innerHTML = '';
    renderComponent('mediaDetails', root);
}

export { renderTitle };