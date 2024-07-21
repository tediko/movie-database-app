import renderComponent from "../../components/renderComponent";

/**
 * Renders the profile page.
 * @param {HTMLElement} root - DOM element where the profile page components will be rendered
 */
const renderProfile = (root) => {
    root.innerHTML = '';
    document.title = `MovieDB - Profile`
    renderComponent('profile', root);
}

export { renderProfile };