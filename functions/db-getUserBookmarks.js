import { getUserBookmarks } from "./db";

/**
 * Handler function for processing HTTP requests in a Netlify function.
 * @async
 * @param {Object} event - The event object containing details about the HTTP request.
 * @returns {Promise<Object>} A promise that resolves to an object containing the HTTP response.
 */
const handler = async (event) => {
    if (event.httpMethod === 'GET') {
        const { userUid } = event.queryStringParameters;

        try {
            const response = await getUserBookmarks(userUid);
            
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

export { handler }