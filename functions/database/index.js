import { getUserBookmarks, getGenres, getRandomMedia, downloadAvatar, updateUserBookmarks, createRecord, uploadAvatar } from './functions';
import { parseAvatar } from '../shared';

/**
 * Handler function for processing HTTP requests in a Netlify function.
 * Supports both GET and POST methods to perform various actions 
 * based on the specified action parameter in the request.
 * @async
 * @param {Object} event - The event object containing details about the HTTP request.
 * @returns {Promise<Object>} A promise that resolves to an object containing the HTTP response.
 */
const handler = async (event) => {
    // Determine the HTTP method of the request
    const isHttpMethodGet = event.httpMethod === 'GET';
    const isHttpMethodPost = event.httpMethod === 'POST';
    let action, params, requestBody;

    // Process query parameters for GET and body for POST requests
    if (isHttpMethodGet || isHttpMethodPost) {
        ({ action, ...params } = event.queryStringParameters || {});

        if (isHttpMethodPost && action !== 'uploadAvatar') {
            requestBody = JSON.parse(event.body);
        }
    }

    // Map of actions to corresponding handler functions
    const actionsMap = {
        getUserBookmarks: async () => await getUserBookmarks(params.userUid),
        getGenres: async () => await getGenres(),
        getRandomMedia: async () => await getRandomMedia(),
        downloadAvatar: async () => await downloadAvatar(params.userUid),
        updateUserBookmarks: async () => await updateUserBookmarks(requestBody.updatedBookmarks, requestBody.userUid),
        createRecord: async () => await createRecord(requestBody.userUid),
        uploadAvatar: async (avatarFileName, avatarBlob) => await uploadAvatar(avatarFileName, avatarBlob)
    }

    try {
        const actionHandler = actionsMap[action];

        if (!actionHandler) {
            return {
                statusCode: 400,
                body: JSON.stringify({error: 'Invalid action'})
            }
        }

        if (action === 'uploadAvatar') {
            const { avatarFileName, avatarBlob } = await parseAvatar(event);
            const response = await actionHandler(avatarFileName, avatarBlob);

            return {
                statusCode: 200,
                body: JSON.stringify(response)
            }
        }

        const response = await actionHandler();
        
        return {
            statusCode: 200,
            body: JSON.stringify(response)
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify(error.message)
        }
    }
}

export { handler }