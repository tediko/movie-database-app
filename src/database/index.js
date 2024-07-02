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

export { getUserBookmarks };