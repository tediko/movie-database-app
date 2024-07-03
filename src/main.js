import './sass/main.scss';
import initGetStartedEmailValidation from './getStartedEmailValidation';
import { initLoginFormValidation, handleLoginButtonClick } from './auth/loginFormValidation';
import { initRegisterFormValidation } from './auth/registerFormValidation';
import initTrailers from './view/displayTrailers';
import initApp from './app';

initGetStartedEmailValidation('[data-home-signup]');
initLoginFormValidation();
initRegisterFormValidation();
handleLoginButtonClick();
initApp();
initTrailers();