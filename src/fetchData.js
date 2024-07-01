// Flags
const apiMovieUrl = 'https://api.themoviedb.org/3/movie/';
const apiTrendingUrl = 'https://api.themoviedb.org/3/trending/all/week';
const shawshankMovieId = 278;
const breakingBadSeriesId = 1396;

// Fetch options
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_TMBD_API_KEY}`
    }
};

/**
 * Fetches upcoming movies from the API and displays them.
 * @async
 * @throws {Error} If there's an issue with the API request or response parsing.
 * @returns {Promise<void>}
 */
async function fetchUpcomingMovies() {
    try {
        const response = await fetch(`${apiMovieUrl}/upcoming?language=en-US&page=1`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const moviesList = data.results.map(movie => {
            return { 
                id: movie.id,
                title: movie.title,
                background: movie.backdrop_path,
                releaseDate: movie.release_date 
            }
        });

        return moviesList;
    } catch (error) {
        console.error(`Error fetching upcoming movies: ${error}`);
        throw error;
    }
}

/**
 * Fetches the trailer source key for a given movie ID.
 * @async
 * @param {number} movieId - The unique identifier of the movie.
 * @throws {Error} If there's an issue with the API request, response parsing , or if no trailer is found.
 * @returns {Promise<string>} The key for the movie's trailer video.
 */
async function fetchTrailerSrcKey(movieId) {
    if (!movieId || typeof movieId !== 'number') {
        throw new TypeError('Invalid movieId. Expected a number');
    }

    try {
        const response = await fetch(`${apiMovieUrl}${movieId}/videos`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const trailerInfo = data.results.find(trailer => trailer.type === "Trailer");

        if (!trailerInfo) {
            throw new Error(`No trailer found for movieId: ${movieId}`);
        }
                
        return trailerInfo.key;
    } catch (error) {
        console.error(`Error fetching trailer src key: ${error}`);
        throw error;
    }
}

/**
 * Fetches the latest trending movies and TV series from the API.
 * @async
 * @throws {Error} If there's an issue with the API request or response parsing.
 * @returns {Object<Array>} An array of objects containing the trending movies and TV series data.
 */
async function fetchTrending() {
    try {
        const response = await fetch(apiTrendingUrl, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const filteredData = data.results.filter((item) => {
            return item.media_type == 'movie' || item.media_type == 'tv';
        }).map((item) => {
            return {
                id: item.id,
                title: item.title || item.name,
                posterPath: item.poster_path,
                type: item.media_type,
                releaseData: item.release_date || item.first_air_date,
                ratingAverage: item.vote_average
            }
        })

        return filteredData;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches movie and TV series recommendations based on the provided IDs.
 * If no IDs are provided, it uses default IDs for Shawshank Redemption and Breaking Bad.
 * @async
 * @param {number|string} [movieId=shawshankMovieId] - The ID of the movie to fetch recommendations for.
 * @param {number|string} [seriesId=breakingBadSeriesId] - The ID of the TV series to fetch recommendations for.
 * @throws {Error} If there's an issue with the API request or response parsing.
 * @returns {Promise<{movies: any[], tvSeries: any[]}>} A promise that resolves with an object containing movie and TVseries recommendations.
 */
async function fetchRecommendations(movieId = shawshankMovieId, seriesId = breakingBadSeriesId) {
    const urls = [
        `https://api.themoviedb.org/3/movie/${movieId}/recommendations`,
        `https://api.themoviedb.org/3/tv/${seriesId}/recommendations`
    ];

    try {
        // Takes an iterable of promises and returns a single Promise.
        const responses = await Promise.all(urls.map(url => fetch(url, options)));

        responses.forEach(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error! Status: ${response.status}`)
            }
        })

        const data = await Promise.all(responses.map(res => res.json()));
    
        return {
            movies: data[0].results,
            tv_series: data[1].results
        }
    } catch (error) {
        throw error;
    }
}

export { fetchUpcomingMovies, fetchTrailerSrcKey, fetchTrending, fetchRecommendations };