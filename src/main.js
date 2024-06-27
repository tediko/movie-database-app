import './sass/main.scss';
import { fetchUpcomingMovies } from './fetchUpcomingMovies';
import initGetStartedEmailValidation from './getStartedEmailValidation';

fetchUpcomingMovies();
initGetStartedEmailValidation('[data-home-signup]');