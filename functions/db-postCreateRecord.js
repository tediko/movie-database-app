import { createRecord } from "./db";

/**
 * Handler function for processing POST requests in a Netlify function to update user bookmarks.
 * @async
 * @param {Object} event - The event object containing details about the HTTP request.
 * @returns {Promise<Object>} A promise that resolves to an object containing the HTTP response.
 * @throws {Error} Throws an error if the request body cannot be parsed or if the update operation fails.
 */
const handler = async (event) => {
    if (event.httpMethod === 'POST') {
        try {
            // Parse the request body
            const requestBody = JSON.parse(event.body);
            await createRecord(requestBody);

            return {
                statusCode: 200,
                body: JSON.stringify(requestBody),
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error }),
            };
        }
    }
}

export { handler };