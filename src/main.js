import './sass/main.scss';
import { fetchUpcomingMovies } from './fetchUpcomingMovies';
import initGetStartedEmailValidation from './getStartedEmailValidation';
import { initLoginFormValidation, handleLoginButtonClick } from './auth/loginFormValidation';

fetchUpcomingMovies();
initGetStartedEmailValidation('[data-home-signup]');
initLoginFormValidation();
handleLoginButtonClick();