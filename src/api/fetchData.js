// Flags
const apiMovieUrl = 'https://api.themoviedb.org/3/movie/';
const apiTrendingUrl = 'https://api.themoviedb.org/3/trending/all/week';
const apiSearchUrl = 'https://api.themoviedb.org/3/search/multi?query=';

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
                backdropPath: item.backdrop_path,
                type: item.media_type,
                releaseData: item.release_date || item.first_air_date,
                ratingAverage: item.vote_average,
                genreIds: item.genre_ids
            }
        })

        return filteredData;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches movie and TV series recommendations based on the provided IDs.
 * @async
 * @param {number|string} movieId - The ID of the movie to fetch recommendations for.
 * @param {number|string} seriesId - The ID of the TV series to fetch recommendations for.
 * @throws {Error} If there's an issue with the API request or response parsing.
 * @returns {Promise<{movies: any[], tvSeries: any[]}>} A promise that resolves with an object containing movie and TVseries recommendations.
 */
async function fetchRecommendations(movieId, seriesId) {
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

        data.forEach(item => {
            if (Array.isArray(item.results) && !item.results.length) {
                throw new Error(`Data error: Data array is empty!`);
            }
        })
    
        return {
            movies: data[0].results.map(item => {
                return {
                    id: item.id,
                    title: item.title,
                    backdropPath: item.backdrop_path,
                    type: item.media_type,
                    releaseData: item.release_date,
                    genreIds: item.genre_ids
                }
            }),
            tv_series: data[1].results.map(item => {
                return {
                    id: item.id,
                    title: item.name,
                    backdropPath: item.backdrop_path,
                    type: item.media_type,
                    releaseData: item.first_air_date,
                    genreIds: item.genre_ids
                }
            })
        }
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches top-rated movies or TV shows from the API.
 * @async
 * @param {('movie'|'tv')} [type='movie'] - The type of content to fetch. Must be either 'movie' or 'tv'. Defaults to 'movie'
 * @param {number} [page=1] - The page number of results to fetch. Defaults to 1.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of filtered content objects.
 * @throws {Error} Throws an error if the HTTP request fails or if there's an issue with the fetch operation.
 */
async function fetchTopRated(type = 'movie', page = 1) {
    const url = `https://api.themoviedb.org/3/${type}/top_rated?language=en-US&page=${page}`;

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        const filteredData = data.results.map((item) => {
            return {
                id: item.id,
                title: item.title || item.name,
                backdropPath: item.backdrop_path,
                type: type,
                releaseData: item.release_date || item.first_air_date,
                ratingAverage: item.vote_average,
                genreIds: item.genre_ids
            }
        })

        return filteredData;
    } catch (error) {
        throw error;
    }
}

/**
 * Fetches search results from an API based on the given search query.
 * @async
 * @param {string} searchQuery - The search query to be used for fetching results.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of filtered and formatted search results.
 * @throws {Error} Throws an error if the API request fails or if there's an HTTP error.
 */
async function fetchSearchResults(searchQuery) {
    const url = `${apiSearchUrl}${searchQuery}&include_adult=false&language=en-US&page=1`

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();
        const filteredData = data.results
            .filter(item => {
                return item.media_type !== 'person' && item.backdrop_path !== null;
            })
            .sort((a, b) => {
                return b.popularity - a.popularity;
            })
            .map((item) => {
                return {
                    id: item.id,
                    title: item.title || item.name,
                    backdropPath: item.backdrop_path,
                    type: item.media_type,
                    releaseData: item.release_date || item.first_air_date,
                    ratingAverage: item.vote_average,
                    genreIds: item.genre_ids
                }
            });

        return filteredData;
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
    const url = `https://api.themoviedb.org/3/${type}/${mediaId}?append_to_response=credits,similar`;

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        return {
            id: data.id,
            title: data.title || data.name,
            backdropPath: data.backdrop_path,
            type: type,
            releaseData: data.release_date || data.first_air_date,
            runTime: data.runtime || data.number_of_seasons,
            ratingAverage: data.vote_average,
            genreIds: data.genres,
            tagline: data.tagline,
            cast: data.credits.cast,
            similar: data.similar.results,
            overview: data.overview
        }
    } catch (error) {
        throw error;
    }
}

export { fetchUpcomingMovies, fetchTrailerSrcKey, fetchTrending, fetchRecommendations, fetchTopRated, fetchSearchResults, fetchMediaDetails };