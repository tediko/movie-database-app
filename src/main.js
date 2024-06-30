import './sass/main.scss';
import { fetchUpcomingMovies } from './fetchData';
import initGetStartedEmailValidation from './getStartedEmailValidation';
import { initLoginFormValidation, handleLoginButtonClick } from './auth/loginFormValidation';
import { initRegisterFormValidation } from './auth/registerFormValidation';
import initTrending from './displayTrending';

fetchUpcomingMovies();
initGetStartedEmailValidation('[data-home-signup]');
initLoginFormValidation();
initRegisterFormValidation();
handleLoginButtonClick();
initTrending();