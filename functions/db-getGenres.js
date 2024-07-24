import { getGenres } from "./db";

/**
 * Handler function for processing HTTP requests in a Netlify function.
 * @async
 * @param {Object} event - The event object containing details about the HTTP request.
 * @returns {Promise<Object>} A promise that resolves to an object containing the HTTP response.
 */
const handler = async (event) => {
    if (event.httpMethod === 'GET') {
        try {
            const response = await getGenres();
            
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