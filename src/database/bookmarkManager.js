import { getUserBookmarks, updateUserBookmarks } from ".";

let bookmarks = [];
let subscribers = [];

/**
 * Initializes the bookmarks by fetching them from the database.
 * Notify subscribers after initialization.
 * @async
 */
async function init() {
    bookmarks = await getUserBookmarks();
}

/**
 * Checks if a bookmark with the given id and type exists in the bookmarks array.
 * @param {number} id - The id of the bookmark to check.
 * @param {string} type - The type of the bookmark to check.
 */
const isBookmarked = (id, type) => {
    return bookmarks.find(item => item.id === id && item.type === type) !== undefined;
}

/**
 * Returns a deep copy of the bookmarks array.
 * @returns {Array<Object>} - A new array containing the same elements as the bookmarks array.
 */
const getBookmarks = () => {
    return [...bookmarks];
}

/**
 * Toggles the bookmark state for the given bookmark and notify subscribers about bookmarks update.
 * If the bookmark exists, it removes it from the current bookmarks array.
 * If the bookmark doesn't exists, it adds it to the current bookmarks array.
 * @async
 * @param {Object} newBookmark - The bookmark object to toggle
 */
async function toggleBookmark(newBookmark) {
    // Find the index of the bookmark in the bookmarks array, if it exists
    const index = bookmarks.findIndex(item => item.id === newBookmark.id && item.type === newBookmark.type);

    // If the bookmark exists (index !== -1), remove it from the array
    // Otherwise, add the new bookmark to the array
    if (index !== -1) {
        bookmarks.splice(index, 1);
    } else {
        bookmarks.push(newBookmark);
    }
    await updateUserBookmarks(bookmarks);
}

/**
 * Subscribes a component to bookmark updates
 * @param {Function} callback - Function to call when bookmarks are updated.
 */
const subscribe = (callback, componentName) => {
    subscribers.push({name: componentName, callback });
}

/**
 * Notifies all subscribers about updates, except the calling component.
 * @param {string} callingComponentName - The name of the component that triggered the update.
 */
const notifySubscribers = (callingComponentName) => {
    const subscribersToNotify = subscribers.filter(subscriber => subscriber.name !== callingComponentName);
    subscribersToNotify.forEach(subscriber => subscriber.callback());
};

/**
 * Unsubscribes a component from bookmark updates.
 * If the callingComponentName is 'all', it unsubscribes all components.
 * @param {string} [callingComponentName=all] - The name of the component to unsubscribe. If not provided, it unsubscribes all components.
 */
const unsubscribe = (callingComponentName = 'all') => {
    if (callingComponentName === 'all') {
        subscribers = [];
    } else {
        subscribers = subscribers.filter(sub => sub.name !== callingComponentName);
    }
}

export const bookmarkManager = {
    init,
    toggleBookmark,
    isBookmarked,
    getBookmarks,
    subscribe,
    unsubscribe,
    notifySubscribers
}