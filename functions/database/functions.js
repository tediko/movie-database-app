const supabase = require('./client.js');
import { base64ToBlob, blobToBase64DataUrl } from "../shared";

/**
 * Fetches bookmarks for the current user from the database.
 * @async
 * @param {string} userUid - Unique user identifier
 * @throws {Error} Throws an error if there's an issue fetching the user or the bookmarks.
 * @returns {Promise<Array>} A promise that resolves to an array of bookmarked items.
 */
async function getUserBookmarks(userUid) {
  try {
      const { data, error } = await supabase
          .from('bookmarks')
          .select('bookmarked')
          .eq('user_uid', userUid);
      
      if (error) {
          throw new Error(`Database error: ${error.message}`);
      }

      return data.map(item => item.bookmarked);
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
          throw new Error(`Database error: ${error.message}`);
      }

      return data.map(item => item.genres);
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
          throw new Error(`Database error: ${error.message}`);
      }

      const mediaPoolArr = data[0].media_pool;
      const randomNumber = Math.floor(Math.random() * mediaPoolArr.length);

      return mediaPoolArr[randomNumber];
  } catch (error) {
      throw error;
  }
}

/**
 * Downloads avatar file from the 'user-avatars' storage bucket.
 * @async
 * @param {string} avatarFileName - Name of the avatar file to download (userUid)
 * @returns {Promise<Object>} A promise that resolves to the response data if successful.
 * @throws {Error} - If there is an error retrieving the data from the database.
 */
async function downloadAvatar(avatarFileName) {
    try {
      const uniqueParam = `?t=${Date.now()}`; // Unique query parameter to prevent image caching
      const fullFileName = `${avatarFileName}${uniqueParam}`;

      const { data, error } = await supabase
          .storage
          .from('user-avatars')
          .download(`${fullFileName}`);

      if (error) {
        throw new Error(`Download error: ${error}`);
      }
      
      const dataUrl = await blobToBase64DataUrl(data);
      return dataUrl;
    } catch (error) {
      throw error;
    }
}

/**
 * Updates bookmarks for the current user to the database.
 * @async
 * @param {Array.<Object>} updatedBookmarks - Array of updated bookmark objects.
 * @param {string} userUid - Unique user identifier
 * @throws {Error} Throws an error if there's an issue fetching the user or updating the bookmarks.
 */
async function updateUserBookmarks(updatedBookmarks, userUid) {
  try {      
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
 * Create a record within database for user. Performs an INSERT into the table.
 * @param {string} userUid - Unique user identifier
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
 * Uploads an avatar file to the storage under the 'user-avatars' bucket.
 * @async
 * @param {string} avatarFileName - Unique identifier for the user, used as the name for the uploaded avatar file.
 * @param {string} base64 - Base64-encoded string representation of the avatar file.
 * @returns {Promise<Object>} A promise that resolves to the response data from the upload operation.
 * @throws {Error} Throws an error if there is a problem during the upload process, including database errors or issues with the Blob conversion.
 */
async function uploadAvatar(avatarFileName, base64) {
  try {
      const avatarBlob = base64ToBlob(base64);
      const { data, error } = await supabase
          .storage
          .from('user-avatars')
          .upload(`${avatarFileName}`, avatarBlob, {
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

export { getUserBookmarks, getGenres, getRandomMedia, downloadAvatar, updateUserBookmarks, createRecord, uploadAvatar };
