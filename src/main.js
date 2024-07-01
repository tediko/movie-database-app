import './sass/main.scss';
import initGetStartedEmailValidation from './getStartedEmailValidation';
import { initLoginFormValidation, handleLoginButtonClick } from './auth/loginFormValidation';
import { initRegisterFormValidation } from './auth/registerFormValidation';
import initTrending from './view/displayTrending';
import initTrailers from './view/displayTrailers';
import initRecommended from './view/displayRecommended';

initGetStartedEmailValidation('[data-home-signup]');
initLoginFormValidation();
initRegisterFormValidation();
handleLoginButtonClick();
initTrending();
initTrailers();
initRecommended();