import { emailValidation, generateRandomName, passwordValidation, showFormMessage } from "../../utilities";
import { getUser, updateUser } from "../../auth/authentication";
import { uploadAvatar, downloadAvatar } from "../../database";
import noAvatarImg from '../../assets/no-avatar.jpg';

// Elements
let profileWrapper;
let profileNameSpan;
let formElement;
let avatarWrapper;
let imageElement;
let avatarInput;
let avatarLabelElement;
let nameInput;
let emailInput;
let passwordInput;

// Selectors
const profileSelector = `[data-profile-wrapper]`;
const formSelector = `[data-profile-form]`
const profileNameSpanSelector = `[data-profile-name]`;
const avatarWrapperSelector = `[data-profile-avatar-wrapper]`;
const avatarInputSelector = `[data-profile-avatar-input]`;
const avatarImgSelector = `[data-profile-avatar-image]`;
const avatarLabelSelector = `[data-profile-avatar-label]`;
const nameInputSelector = `input[name="name"]`;
const emailInputSelector = `input[name="email"]`;
const passwordInputSelector = `input[name="password"]`;

// State
let userUploadedAvatarFile;
let userId;
let userEmail;
let userName;

// Flags
const maxFileSize = 250; // kilobytes (KB)
const errorClass = 'has-error';

/**
 * Initializes profile component
 */
async function initProfile() {
    profileWrapper = document.querySelector(profileSelector);
    profileNameSpan = document.querySelector(profileNameSpanSelector);
    formElement = document.querySelector(formSelector);
    avatarWrapper = document.querySelector(avatarWrapperSelector);
    imageElement = document.querySelector(avatarImgSelector);
    avatarInput = document.querySelector(avatarInputSelector);
    nameInput = formElement.querySelector(nameInputSelector);
    emailInput = formElement.querySelector(emailInputSelector);
    passwordInput = formElement.querySelector(passwordInputSelector);

    if (!profileWrapper) return;

    // Get user data and avatar blob object
    const { id, email, user_metadata } = await getUser();
    const avatarBlob = await downloadAvatar(id);
    
    // Display downloaded avatar image
    displayAvatar(imageElement, avatarBlob);

    // Update state
    userId = id;
    userEmail = email;
    userName = user_metadata.name;

    // Update appropriate elements with user data
    nameInput.value = userName;
    emailInput.value = userEmail;
    profileNameSpan.innerHTML = userName;

    // Set up event listeners
    avatarWrapper.addEventListener('click', () => avatarInput.click());
    avatarInput.addEventListener('change', handleAvatarUpload);
    formElement.addEventListener('submit', handleFormSubmit);
}

/**
 * Handles the form submission event.
 * @param {Event} event - Event object representing the form submission.
 */
const handleFormSubmit = (event) => {
    event.preventDefault();
    let nameValue = nameInput.value;
    const emailValue = emailInput.value;
    const passwordValue = passwordInput.value;
    
    // Validate form and return array with error messages if any.
    let validationResult = formValidation(userId, emailValue, nameValue, passwordValue);
    
    // Generate random name when nameValue string is empty
    if (nameValue.length === 0) {
        nameValue = generateRandomName();
        userName = nameValue;
    }

    // Display error message when validationResult returns array of errors
    if (validationResult) {
        showFormMessage(formElement, validationResult, false);
        return;
    }

    // Upload avatar to storage if user uploaded file
    if (userUploadedAvatarFile) {
        uploadAvatar(userId, userUploadedAvatarFile);
        avatarLabelElement.innerHTML = `Image cannot be more than 250KB`;
    }

    // Update user, update elements and show form message
    updateUser(emailValue, nameValue, passwordValue);
    nameInput.value = nameValue;
    profileNameSpan.innerHTML = nameValue;
    passwordInput.value = '';
    showFormMessage(profileWrapper, ['Profile updated successfully!'], true);
}

/**
 * Validates profile form.
 * @param {string} uid - Unique identifier for the user account.
 * @param {string} email - Email address of the user.
 * @param {string} name - Name of the user.
 * @param {string} password - Password for the user account.
 * @returns {(string[]|null)} An array of error messages if validation fails, or null if validation passes.
 */
const formValidation = (uid, email, name, password) => {
    const testAccountUid = `3cc0964a-a9a8-4c6f-bb2c-cd378291a0c5`;
    let errors = [];
    
    // Checks if currently logged user is on test account
    if (uid === testAccountUid) {
        errors.push('Profile editing is disabled for test account. Sign up for a regular account to access all features.');
        return errors;
    }
    
    // Checks if name is more than 15 characters
    if (name.length > 15) {
        errors.push('Name is too long. Must be less than 15 characters')
    }

    // Checks if email doesn't pass validation
    if (!emailValidation(email)) {
        errors.push('Invalid email address');
    }

    // Checks if password doesn't pass validation
    if (!passwordValidation(password) && password.length > 0) {
        errors.push('Incorrect password (min. 6 characters)');
    }

    return errors.length > 0 ? errors : null;
}

/**
 * Handles the avatar upload process, including file validation and image src change.
 * @param {Event} event - The change event triggered by the file input.
 */
const handleAvatarUpload = (event) => {
    avatarLabelElement = document.querySelector(avatarLabelSelector);
    const uploadedFile = event.target.files[0];
    const fileSize = Math.round(uploadedFile.size / 1000); // convert bytes to kilobytes (KB)
    const fileName = uploadedFile.name;

    // Check if the selected file is an image
    if (!uploadedFile.type.startsWith('image/')) {
        avatarLabelElement.innerHTML = `Selected file is not an image`;
        avatarLabelElement.classList.add(errorClass);
        return;
    }
    
    // Check if the selected file size is less or equal to 250kb
    if (fileSize >= maxFileSize) {
        avatarLabelElement.innerHTML = `File is too large. Please upload an image under 250 KB.`;
        avatarLabelElement.classList.add(errorClass);
        return;
    }

    loadImageFromBlob(uploadedFile, imageElement);

    avatarLabelElement.innerHTML = `Selected file: ${fileName}`;
    avatarLabelElement.classList.remove(errorClass);
    userUploadedAvatarFile = uploadedFile;
}

/**
 * Displays an avatar image in an imageElement.
 * @param {Blob|null} avatar - The Blob object representing the avatar image, or null if no avatar is available.
 * @param {HTMLImageElement} imageElement - The image element where the avatar will be displayed.
 */
const displayAvatar = (imageElement, avatar) => {
    if (avatar === null) {
        imageElement.src = noAvatarImg;
    } else {
        loadImageFromBlob(avatar, imageElement);
    }
}

/**
 * Loads an image from a Blob object and sets it as the source of an given element.
 * @param {Blob} blob - Blob object representing the image data.
 * @param {HTMLImageElement} imageElement - Image element where the image will be displayed.
 */
const loadImageFromBlob = (blob, imageElement) => {
    // Creates a temporary URL that points to a file/blob object
    const objectUrl = URL.createObjectURL(blob);
    // Cleanup. Release the memory associated with the object URL after image is loaded.
    imageElement.onload = () => URL.revokeObjectURL(objectUrl);
    // Set image src with temporary URL
    imageElement.src = objectUrl;
}

/**
 * Returns HTML for the profile component.
 * @returns {string} HTML for the profile component.
 */
const getProfileHtml = () => {
    return `
        <div class="profile__container" data-profile-wrapper>
            <h2 class="profile__title fs-600 fw-300 text-white">Profile<span class="fs-500 fw-500 text-blue-grayish" data-profile-name>&nbsp;</span></h2>
            <div class="profile__avatar">
                <div class="profile__avatar-container">
                    <input class="sr-only" accept="image/jpeg,image/png" id="avatar" type="file" data-profile-avatar-input>
                    <div class="profile__avatar-wrapper" data-profile-avatar-wrapper>
                        <img class="profile__avatar-image" src="" alt="Preview" data-profile-avatar-image>
                    </div>
                    <div class="profile__avatar-label-wrapper">
                        <label class="profile__avatar-label fs-400 fw-500 text-white" for="avatar">Avatar</label>
                        <p class="profile__avatar-label-desc fs-200 text-white50" aria-live="polite" data-profile-avatar-label>Image cannot be more than 250KB</p>
                    </div>
                </div>
            </div>
            <form action="" novalidate class="profile__form" data-profile-form>
                <div class="profile__input-wrapper">
                    <label class="profile__label profile__label--user fs-200 text-white" for="name">Name</label>
                    <input class="profile__input fs-300 fw-300 text-white" type="text" name="name" id="name" placeholder="Name">
                </div>
                <div class="profile__input-wrapper">
                    <label class="profile__label profile__label--email fs-200 text-white" for="email">Email<sup aria-hidden="true" class=" fs-200 text-red">*</sup></label>
                    <input class="profile__input fs-300 fw-300 text-white" type="email" name="email" id="email" placeholder="Email address">
                </div>
                <div class="profile__input-wrapper">
                    <label class="profile__label profile__label--password fs-200 text-white" for="password">New password</label>
                    <input class="profile__input fs-300 fw-300 text-white" type="password" name="password" id="password" placeholder="New password">
                </div>
                <p class="profile__error fs-300 fw-300 text-red" aria-hidden="true" aria-live="polite" data-form-message></p>
                <button class="profile__submit-cta cta-access" type="submit">Update profile</button>
            </form>
        </div>`;
}

export { getProfileHtml, initProfile };