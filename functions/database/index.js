import { getUserBookmarks, getGenres, getRandomMedia, downloadAvatar, updateUserBookmarks, createRecord, uploadAvatar } from './functions';

/**
 * Handler function for processing HTTP requests in a Netlify function.
 * @async
 * @param {Object} event - The event object containing details about the HTTP request.
 * @returns {Promise<Object>} A promise that resolves to an object containing the HTTP response.
 */
const handler = async (event) => {
    if (event.httpMethod === 'GET') {
        const { action, ...params } = event.queryStringParameters || {};

        const actionsMap = {
            getUserBookmarks: async () => await getUserBookmarks(params.userUid),
            getGenres: async () => await getGenres(),
            getRandomMedia: async () => await getRandomMedia(),
            downloadAvatar: async () => await downloadAvatar(params.userUid)
        }
        
        try {
            const actionHandler = actionsMap[action];

            if (!actionHandler) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({error: 'Invalid action'})
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

    if (event.httpMethod === 'POST') {
        const { action } = event.queryStringParameters || {};
        const requestBody = JSON.parse(event.body);

        const actionsMap = {
            updateUserBookmarks: async () => await updateUserBookmarks(requestBody.updatedBookmarks, requestBody.userUid),
            createRecord: async () => await createRecord(requestBody.userUid),
            uploadAvatar: async () => await uploadAvatar(requestBody.avatarFileName, requestBody.base64)
        }
        
        try {
            const actionHandler = actionsMap[action];

            if (!actionHandler) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({error: 'Invalid action'})
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
}

export { handler }