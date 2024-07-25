import supabase from "./client";
import { generateRandomName } from "../utilities";

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
            options: {
                data: {
                    name: generateRandomName()
                }
            }
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
 */
async function signOut() {
    await supabase.auth.signOut();
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

/**
 * Updates user information in the Supabase authentication system.
 * @async
 * @param {string} email - The email address of the user to update.
 * @param {string} name - The new name of the user.
 * @param {string} password - The new password of the user. If an empty string, the password will not be updated.
 * @returns {Promise<Object>} A promise that resolves to the updated user data if the update is successful.
 * @throws {Error} Throws an error if there is an issue updating the user, including any errors returned from Supabase.
 */
async function updateUser(email, name, password) {
    const updateData = {
        email,
        data: {
            name
        }
    }

    // Check if password isn't an empty string
    if (password !== '') {
        updateData.password = password;
    }

    try {
        const { data, error } = await supabase.auth.updateUser(updateData);

        if (error) {
            throw new Error(`Error updating user: ${error.message}`);
        }

        return data;
    } catch (error) {
        throw error;
    }
}

export  { signIn, getUser, signUp, signOut, updateUser };