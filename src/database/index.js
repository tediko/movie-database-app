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

export { getUserBookmarks, updateUserBookmarks, getGenres };