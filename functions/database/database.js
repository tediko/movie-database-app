import supabase from "./client"

const handler = async (event) => {
  if (event.httpMethod === 'GET') {
    const { userUid } = event.queryStringParameters;

    try {
      const response = await getRandomMedia();
    
      return {
        statusCode: 200,
        body: JSON.stringify(response)
      }

    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message })
      }
    }
  }
}

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
 * @param {string} avatarFileName - The name of the avatar file to download.
 * @returns {Promise<Object|null>} A promise that resolves to the response data if successful, or null if an error occurs.
 */
async function downloadAvatar(avatarFileName) {
    const uniqueParam = `?t=${Date.now()}`; // Unique query parameter to prevent image caching
    const fullFileName = `${avatarFileName}${uniqueParam}`;

    const { data, error } = await supabase
        .storage
        .from('user-avatars')
        .download(`${fullFileName}`);

    if (error) return null;

    return data;
}

export { handler };
