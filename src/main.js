import './sass/main.scss';
import { fetchUpcomingMovies } from './fetchUpcomingMovies';
import initGetStartedEmailValidation from './getStartedEmailValidation';
import { initLoginFormValidation, handleLoginButtonClick } from './auth/loginFormValidation';
import { initRegisterFormValidation } from './auth/registerFormValidation';

fetchUpcomingMovies();
initGetStartedEmailValidation('[data-home-signup]');
initLoginFormValidation();
initRegisterFormValidation();
handleLoginButtonClick();