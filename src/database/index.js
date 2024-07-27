import { getUser } from "../auth/authentication";
import { blobToBase64 } from "../utilities";

// Flags
const databaseEndpoint = `/.netlify/functions/database`;
const endpoints = {
    getUserBookmarks: `${databaseEndpoint}?action=getUserBookmarks`,
    getGenres: `${databaseEndpoint}?action=getGenres`,
    getRandomMedia: `${databaseEndpoint}?action=getRandomMedia`,
    downloadAvatar: `${databaseEndpoint}?action=downloadAvatar`,
    updateUserBookmarks: `${databaseEndpoint}?action=updateUserBookmarks`,
    createRecord: `${databaseEndpoint}?action=createRecord`,
    uploadAvatar: `${databaseEndpoint}?action=uploadAvatar`
};

/**
 * Asynchronously retrieves the bookmarks for the current user making request to Netlify function `db-getUserBookmarks` to retrieve the user
 * bookmarks
 * @async
 * @returns {Promise<Object>} A promise that resolves to object.
 * @throws {Error} Throws an error if the user cannot be retrieved or if the fetch request fails.
 */
async function getUserBookmarks() {
    try {
        // First await the getUser() function to get the userUid.
        const { id: userUid } = await getUser();
        const response = await fetch(`${endpoints.getUserBookmarks}&userUid=${userUid}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        return data[0];
    } catch (error) {
        throw error;
    }
}

/**
 * Asynchronously retrieves the movie/TVseries genres list making request to Netlify function `db-getGenres`
 * @async
 * @returns {Promise<Object>} A promise that resolves to object.
 * @throws {Error} Throws an error if the user cannot be retrieved or if the fetch request fails.
 */
async function getGenres() {
    try {
        const response = await fetch(endpoints.getGenres);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        return data[0];
    } catch (error) {
        throw error;
    }
}

/**
 * Asynchronously retrieves random media object representing either movie or tv series id and type making request to Netlify function `db-getRandomMedia`
 * @async
 * @returns {Promise<Object>} A promise that resolves to object.
 * @throws {Error} Throws an error if the user cannot be retrieved or if the fetch request fails.
 */
async function getRandomMedia() {
    try {
        const response = await fetch(endpoints.getRandomMedia);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Asynchronously retrieves base64 string containing user avatar by making request to Netlify function `db-getUserAvatar`
 * @async
 * @returns {Promise<String|null>} A promise that resolves to string or null.
 */
async function downloadAvatar() {
    // First await the getUser() function to get the userUid.
    const { id: userUid } = await getUser();
    const response = await fetch(`${endpoints.downloadAvatar}&userUid=${userUid}`);
    const data = await response.json();

    if (!response.ok) {
        return '/assets/no-avatar.jpg';
    }

    return data;
}

/**
 * Updates the user bookmarks by sending a POST request to a `db-postUpdateUserBookmarks` Netlify function.
 * @async
 * @param {Array} updatedBookmarks - Array of updated bookmark objects.
 * @returns {Promise<void>} Promise that resolves when the update operation is complete.
 * @throws {Error} Throws an error if the request to the server fails or if the user cannot be retrieved.
 */
async function updateUserBookmarks(updatedBookmarks) {
    try {
        // First await the getUser() function to get the userUid.
        const { id: userUid } = await getUser();
        const response = await fetch(endpoints.updateUserBookmarks, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({updatedBookmarks, userUid}),
        });

        if (!response.ok) {
            throw new Error('Failed to send data');
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Creates a new record in the database by fetching the user ID and sending a POST request
 * to the `db-postCreateRecord` Netlify function
 * @async
 * @param {string} userUid - Unique user identifier
 * @returns {Promise<void>} A promise that resolves when the record is created successfully.
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 */
async function createRecord(userUid) {
    try {
        const response = await fetch(endpoints.createRecord, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({userUid}),
        });

        if (!response.ok) {
            throw new Error('Failed to send data');
        }

    } catch (error) {
        throw error;
    }
}

/**
 * Uploads an avatar file by converting it to a Base64 string and sending a POST request to the `db-postUploadAvatar` Netlify function.
 * @async
 * @param {string} avatarFileName - Unique identifier for the user, used as the name for the uploaded avatar file.
 * @param {File} avatarFile - The avatar file object to be uploaded.
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 */
async function uploadAvatar(avatarFileName, avatarFile) {
    try {
        const base64 = await blobToBase64(avatarFile);
        const response = await fetch(endpoints.uploadAvatar, {
            method: 'POST',
            body: JSON.stringify({avatarFileName, base64}),
        });
        
        if (!response.ok) {
            throw new Error('Failed to send data');
        }
    } catch (error) {
        throw error;
    }
}


export { getUserBookmarks, getGenres, getRandomMedia, downloadAvatar, updateUserBookmarks, createRecord, uploadAvatar };