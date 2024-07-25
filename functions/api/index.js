import { fetchUpcomingMovies, fetchTrailerSrcKey, fetchTrending, fetchRecommendations, fetchTopRated, fetchSearchResults, fetchMediaDetails } from './functions';

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
            fetchUpcomingMovies: async () => {
                return await fetchUpcomingMovies();
            },
            fetchTrailerSrcKey: async () => {
                const movieId = parseInt(params.movieId);
                return await fetchTrailerSrcKey(movieId);
            },
            fetchTrending: async () => {
                return await fetchTrending();
            },
            fetchRecommendations: async () => {
                return await fetchRecommendations(params.movieId, params.seriesId);
            },
            fetchTopRated: async () => {
                return await fetchTopRated(params.type, params.page);
            },
            fetchSearchResults: async () => {
                return await fetchSearchResults(params.searchQuery);
            },
            fetchMediaDetails: async () => {
                return await fetchMediaDetails(params.type, params.mediaId);
            }
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