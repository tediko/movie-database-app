import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ddjybinwcsbmxniubgqr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Asynchronously signs in a user with their email and password using Supabase authentication.
 * @async
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @throws {Error} Throws an error with a specific message if the sign-in process fails.
 * @returns {Promise<void>} A promise that resolves if the sign-in is successful.
 */
async function signInWithPassword(email, password) {
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
 * Gets the current user details if there is an existing session. This method
 * performs a network request to the Supabase Auth server, so the returned
 * value is authentic and can be used to base authorization rules on.
 * @returns {Object} - Object with current user details
 */
async function getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export  { signInWithPassword, getUser, signUp };