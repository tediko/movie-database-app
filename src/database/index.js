import supabase from "./client";
import { getUser } from "../auth/authentication";

/**
 * Fetches bookmarks for the current user from the database.
 * @async
 * @throws {Error} Throws an error if there's an issue fetching the user or the bookmarks.
 * @returns {Promise<Array>} A promise that resolves to an array of bookmarked items.
 */
async function getUserBookmarks() {
    try {
        // First await the getUser() function to get the userUid.
        const { id: userUid } = await getUser();

        // Once we have the userUid, we use it in supabase query to fetch the bookmarks
        const { data: bookmarks, error } = await supabase
            .from('bookmarks')
            .select('bookmarked')
            .eq('user_uid', userUid);
        
        if (error) {
            throw new Error(`Database error: ${error}`);
        }

        return bookmarks[0].bookmarked;
    } catch (error) {
        throw error;
    }
}

/**
 * Updates bookmarks for the current user to the database.
 * @async
 * @param {Array.<Object>} updatedBookmarks -  Array of updated bookmark objects.
 * @throws {Error} Throws an error if there's an issue fetching the user or updating the bookmarks.
 * @returns {Promise}
 */
async function updateUserBookmarks(updatedBookmarks) {
    try {
        // First await the getUser() function to get the userUid.
        const { id: userUid } = await getUser();
        
        // Once we have the userUid, we use it in supabase query to update the bookmarks
        const { error } = await supabase
            .from('bookmarks')
            .update({ bookmarked: updatedBookmarks})
            .eq('user_uid', userUid)
            .select('bookmarked');
        
        if (error) {
            throw new Error(error);
        }

    } catch (error) {
        throw error;
    }
}

/**
 * Fetches movie/TVseries genres list from the database.
 * @async
 * @throws {Error} Throws an error if there's an issue fetching the user or the bookmarks.
 * @returns {Promise<Array>} A promise that resolves to an array of genres items.
 */
async function getGenres() {
    try {
        const { data, error } = await supabase
            .from('content')
            .select('genres')
            .eq('id', 1);
        
        if (error) {
            throw new Error(`Database error: ${error}`);
        }

        return data[0].genres;
    } catch (error) {
        throw error;
    }
}

/**
 * Create a record within database for user. Performs an INSERT into the table.
 * @param {string} userUid - User identifier assigned to user
 */
async function createRecord(userUid) {
    try {
        const { error } = await supabase
        .from('bookmarks')
        .insert({ user_uid: userUid });

        if (error) {
            throw new Error(`Database error: ${error}`);
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Retrieves a random media item representing either movie or tv series id and type.
 * @returns {Promise<object>} - A promise that resolves to an object representing the random media item.
 * @throws {Error} - If there is an error retrieving the data from the database.
 */
async function getRandomMedia() {
    try {
        const { data, error } = await supabase
            .from('content')
            .select('media_pool')
            .eq('id', 1);
        
        if (error) {
            throw new Error(`Database error: ${error}`);
        }

        const mediaPoolArr = data[0].media_pool;
        const randomNumber = Math.floor(Math.random() * mediaPoolArr.length);

        return mediaPoolArr[randomNumber];
    } catch (error) {
        throw error;
    }
}

/**
 * Uploads an avatar file to the storage under the 'user-avatars' bucket.
 * @async
 * @param {string} avatarFileName - Unique identifier for the user, used as the name for uploaded avatar file.
 * @param {File} avatarFile - Avatar file object.
 * @returns {Promise<Object>} A promise that resolves to response data from the upload operation.
 * @throws {Error} Throws an error if there is a problem during the upload process, including database errors.
 */
async function uploadAvatar(avatarFileName, avatarFile) {
    try {
        const { data, error } = await supabase
            .storage
            .from('user-avatars')
            .upload(`${avatarFileName}`, avatarFile, {
                cacheControl: 'no-cache',
                upsert: true
            });
        
        if (error) {
            throw new Error(`Database error uploading avatar: ${error}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Downloads avatar file from the 'user-avatars' storage bucket.
 * @async
 * @param {string} avatarFileName - The name of the avatar file to download.
 * @returns {Promise<Object|null>} A promise that resolves to the response data if successful, or null if an error occurs.
 */
async function downloadAvatar(avatarFileName) {
    const { data, error } = await supabase
        .storage
        .from('user-avatars')
        .download(`${avatarFileName}`);

    if (error) return null;

    return data;
}

export { getUserBookmarks, updateUserBookmarks, getGenres, createRecord, getRandomMedia, uploadAvatar, downloadAvatar };