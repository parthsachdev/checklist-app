import {Router} from 'express';
import * as handler from './handler';
import * as utils from './utils';
import * as uiHandler from './uiHandler';

export const router: Router = Router();

router.post('/login', handler.login);
router.post('/register', handler.register);
router.post('/verify-email', handler.verifyEmail);

router.get('/categories', utils.decodeJWTFromHeader, handler.getCategories);
router.put('/categories', utils.decodeJWTFromHeader, handler.updateCheckList);

router.get('/app/login', uiHandler.loginPage);
router.get('/app/register', uiHandler.registerPage);
router.get('/app/categories', uiHandler.categoriesPage);
