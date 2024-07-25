// Flags
const fetchDataEndpoint = `/.netlify/functions/api`;
const endpoints = {
    fetchUpcomingMovies: `${fetchDataEndpoint}?action=fetchUpcomingMovies`,
    fetchTrailerSrcKey: `${fetchDataEndpoint}?action=fetchTrailerSrcKey`,
    fetchTrending: `${fetchDataEndpoint}?action=fetchTrending`,
    fetchRecommendations: `${fetchDataEndpoint}?action=fetchRecommendations`,
    fetchTopRated: `${fetchDataEndpoint}?action=fetchTopRated`,
    fetchSearchResults: `${fetchDataEndpoint}?action=fetchSearchResults`,
    fetchMediaDetails: `${fetchDataEndpoint}?action=fetchMediaDetails`
}

/**
 * Fetches upcoming movies from a Netlify serverless function.
 * @async
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of movie objects.
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 */
async function fetchUpcomingMovies() {
    try {
        const response = await fetch(endpoints.fetchUpcomingMovies);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches trailer source key for given movieId from a Netlify serverless function.
 * @async
 * @param {string|number} movieId - The movie ID for trailer as a string or number
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of movie objects.
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 */
async function fetchTrailerSrcKey(movieId) {
    try {
        const response = await fetch(`${endpoints.fetchTrailerSrcKey}&movieId=${movieId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches the latest trending movies and TV series from a Netlify serverless function.
 * @async
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of movies and TV series objects.
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 */
async function fetchTrending() {
    try {
        const response = await fetch(endpoints.fetchTrending);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches movie and TV series recommendations based on the provided IDs from a Netlify serverless function.
 * @async
 * @param {string|number} movieId - The ID of the movie to fetch recommendations for.
 * @param {string|number} seriesId - The ID of the tv series to fetch recommendations for.
 * @returns {Promise<{movies: any[], tvSeries: any[]}>} A promise that resolves with an object containing movie and TVseries recommendations.
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 */
async function fetchRecommendations(movieId, seriesId) {
    try {
        const response = await fetch(`${endpoints.fetchRecommendations}&movieId=${movieId}&seriesId=${seriesId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches top-rated movies or TV shows from a Netlify serverless function.
 * @async
 * @param {('movie'|'tv')} [type='movie'] - The type of content to fetch. Must be either 'movie' or 'tv'. Defaults to 'movie'
 * @param {number} [page=1] - The page number of results to fetch. Defaults to 1.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of filtered content objects.
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 */
async function fetchTopRated(type = 'movie', page = 1) {
    try {
        const response = await fetch(`${endpoints.fetchTopRated}&type=${type}&page=${page}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches search results based on the given search query from a Netlify serverless function.
 * @async
 * @param {string} searchQuery - The search query to be used for fetching results.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of filtered and formatted search results.
 * @throws {Error} Throws an error if the fetch request fails or if the response is not ok.
 */
async function fetchSearchResults(searchQuery) {
    try {
        const response = await fetch(`${endpoints.fetchSearchResults}&searchQuery=${searchQuery}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches detailed information about a media item (movie or TV show).
 * @async
 * @param {string} type - The type of media ('movie' or 'tv').
 * @param {string|number} mediaId - The unique identifier of the media item.
 * @returns {Promise<Object>} A promise that resolves to an object containing the media details.
 * @throws {Error} Throws an error if the API request fails or returns a non-OK status.
 */
async function fetchMediaDetails(type, mediaId) {
    try {
        const response = await fetch(`${endpoints.fetchMediaDetails}&type=${type}&mediaId=${mediaId}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export { fetchUpcomingMovies, fetchTrailerSrcKey, fetchTrending, fetchRecommendations, fetchTopRated, fetchSearchResults, fetchMediaDetails };