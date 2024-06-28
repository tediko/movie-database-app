# MovieDB fullstack app


**MovieDB** is a **full-stack** application that serves as an interactive hub for movie and TV series enthusiasts. To provide seamless *user authentication* and *data management* I used **Supabase** backend-as-a-service (BaaS) solution. This integration ensures secure user *registration*, *login* process and efficient *session management* which enables users to build their own collection by *bookmarking* favorite movies and TV series, with all user-specific data securely stored in the database. The app fetches the data from **The Movie Database (TMDb) API** to deliver up-to-date and extensive information on films and TV shows. MovieDB App allows users to explore, search, bookmark and engage with a vast collection of media content as well as display information about a specific movie/TV series on sub-page.

With the integration of user authentication I've decided to elevate app functionality and user experience by **designing an landing page** that serves as the introduction to MovieDB App. This landing page streamlines the user authentication process by providing registration form and login cta button redirecting respectively to register and login sub-page. Moreover showcases selection of popular movie trailers in slider that users can watch in popping modal lightbox. Additionally, there is a placeholder section with mockup image that contain video within.

- Live Site URL: [moviedb-tediko.netlify.app](https://moviedb-tediko.netlify.app/)

## Table of contents

- [My process](#my-process)
  - [What I learned](#what-i-learned)
  - [Built with](#built-with)
- [Setup](#setup)
- [Overview](#overview)
  - [Screenshot](#screenshot)
- [Author](#author)

## My process

### 1. Fetching data and handling  errors using try…catch block
I'm using the `fetch API` with predefined options and URL parameters. Within my *try block*, I first check if the response is successful. If it's not, I immediately *throw an error* with the HTTP status code. This prevents any further execution with invalid data. If the response is successful, I *parse the JSON data* and return it. For error handling, I've implemented a *catch block*. This catches any errors thrown during the fetch operation, response handling, or data processing. I then re-throw the error, allowing for centralized error handling or logging at a higher level in my application. I've structured my code this way to ensure that network issues, API errors, or data processing problems are caught and can be handled 
gracefully. This approach significantly improves the robustness and reliability of my application.
```js
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
```
`throw error` within catch block in the `fetchTrailerSrcKey()` pass the error to an outer `try...catch` block for further handling where I display error in the app: 
```js
async function fetchTrailerAndDisplayLightbox(targetMovieId, trailerData) {
    try {
        const trailerSrcKey = await fetchTrailerSrcKey(targetMovieId);
        displayLightbox(trailerData, trailerSrcKey);
    } catch (error) {
        if (error.message.includes('No trailer found')) {
            displayLightboxError(trailerData, 'No trailer available for this movie');
        } else {
            displayLightboxError(trailerData, 'There was a problem connecting to the server');
        }
    }
}
```
### 2. Authentication process
I used the **Supabase** *client library* for authentication process. I've start by initializing the Supabase client with the *project URL* and *API key*, which is securely stored as an environment variable `VITE_SUPABASE_KEY`:
```js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ddjybinwcsbmxniubgqr.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
```
The authentication functionality is implemented through three main functions: `signIn`, `signUp`, and `getUser`. The former two functions allows users to sign in/up with their email and password, handling various error scenarios with custom error messages. When a user signs in successfully, Supabase generates a JSON Web Token (JWT) that represents the user's session. This token is automatically saved in the browser's local storage:
```js
async function signIn(email, password) {
  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      const errorMessages = {
        400: 'Invalid login credentials.',
        401: 'Unauthorized access. Please check your credentials.',
        429: 'Too many login attempts. Please try again later.',
      };
      const errorMessage = errorMessages[error.status] || `An unexpected error occurred: ${error.message}`;
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw error;
  }
}
```
The `getUser` function is responsible for retrieving the details of the currently signed-in user. It utilizes Supabase's *getUser* method to make a network request to the Supabase Auth server, ensuring that the returned user data is authentic and can be used for authorization purposes. The getUser function retrieves this session JWT token from the browser's storage and includes it in the request to the Supabase Auth server. Supabase verifies the token's validity and returns the corresponding user details.
```js
async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}
```
### 3. Focus trap
Implemented focus trap that ensures the user focus remains within a specified container when the user navigates throught page with tab key. This is useful for creating accessible modals or other interactive elements that should keep the focus within them. The focus trap identifies all focusable elements within the container and sets up event listeners to handle `Tab` key presses. When the user presses Tab while on the last focusable element, the focus is moved to the first focusable element. Similarly, when `Shift+Tab` is pressed while on the first focusable element, the focus is moved to the last focusable element:
```js
const focusTrap = (container) => {
    const focusableElements = container.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input[type="text"]:not([disabled]), input[type="radio"]:not([disabled]), input[type="checkbox"]:not([disabled]), select:not([disabled])');
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];
    const tabKey = 'Tab';

    container.setAttribute('tabindex', '-1');
    container.focus();

    container.addEventListener('keydown', (event) => {
        const pressedKey = event.key;
        const isTabPressed = pressedKey === tabKey;
        
        if (!isTabPressed) return;
        
        if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                event.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                event.preventDefault();
                firstFocusableElement.focus();
            }
        }
    })
}
```
### 4. Query URL parameters
Query parameters are a defined set of parameters (key-value pair) attached to the end of a URL used to provide additional information to a web server when making requests. I used them to send an email from the landing page get started form to the registration page and autocomplete it in the input. Firstly, I redirect the user to a new page, specifically access/register.html, and includes a query parameter email with a value from inputValue `window.location.href = "access/register.html?email=\${inputValue}";`. This means that when the user is redirected to the register.html page, the URL will contain a query string like ?email=some_email@example.com. Then retrieves a specific query parameter from the current URL:
```js
const getUrlQueryParameters = (name) => {
    const newParams = new URLSearchParams(window.location.search);
    return newParams.get(name);
}
```