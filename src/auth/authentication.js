import supabase from "../database/client";

/**
 * Asynchronously signs in a user with their email and password using Supabase authentication.
 * @async
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @throws {Error} Throws an error with a specific message if the sign-in process fails.
 * @returns {Promise<void>} A promise that resolves if the sign-in is successful.
 */
async function signIn(email, password) {
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            const errorMessages = {
                400: 'Invalid login credentials.',
                401: 'Unauthorized access. Please check your credentials.',
                429: 'Too many login attempts. Please try again later.',
            };

            const errorMessage = errorMessages[error.status] || `An unexpected error occurred: ${error.message}`;
            throw new Error(errorMessage);
        }

    } catch(error) {
        throw error;
    }
}

/**
 * Asynchronously signs up new user with their email and password using Supabase authentication.
 * (there are no documented error codes like in sign-in)
 * @async
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @throws {Error} Throws an error with a specific message if the sign-up process fails.
 * @returns {Promise<void>} A promise that resolves if the sign-up is successful.
 */
async function signUp(email, password) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            throw new Error(error);
        }

        return data;
    } catch(error) {
        throw error;
    }
}

/**
 * Removes the logged in user from the browser session and log them out - removing all items from localstorage.
 * Redirects to landing page.
 */
async function signOut() {
    await supabase.auth.signOut();
    window.location.href = '/index.html';
}

/**
 * Gets the current user details if there is an existing session. This method
 * performs a network request to the Supabase Auth server, so the returned
 * value is authentic and can be used to base authorization rules on.
 * @returns {Object} - Object with current user details
 */
async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export  { signIn, getUser, signUp, signOut };