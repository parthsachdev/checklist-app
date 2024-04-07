import {NextFunction, Request, Response, Router} from 'express';
import * as handler from './handler';
import * as utils from './utils';

export const router: Router = Router();

router.get('/', (req: Request, res: Response, next: NextFunction) => res.redirect('/app'));
router.post('/login', handler.login);
router.post('/register', handler.register);
router.post('/verify-email', handler.verifyEmail);

router.get('/categories', utils.decodeJWTFromHeader, handler.getCategories);
router.put('/categories', utils.decodeJWTFromHeader, handler.updateCheckList);
