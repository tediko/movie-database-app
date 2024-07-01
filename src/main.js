import './sass/main.scss';
import initGetStartedEmailValidation from './getStartedEmailValidation';
import { initLoginFormValidation, handleLoginButtonClick } from './auth/loginFormValidation';
import { initRegisterFormValidation } from './auth/registerFormValidation';
import initTrending from './displayTrending';
import initTrailers from './displayTrailers';
import initRecommended from './displayRecommended';

initGetStartedEmailValidation('[data-home-signup]');
initLoginFormValidation();
initRegisterFormValidation();
handleLoginButtonClick();
initTrending();
initTrailers();
initRecommended();