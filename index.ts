import express, {Express} from 'express';
import {router} from './src/router';
import * as postgres from './src/postgres';
import { NextFunction, Request, Response } from "express";
import config from 'config';
import path from 'path';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`Request received for ${req.method} ${req.url}`);
	next();
});
app.use(express.static('ui'));
app.use('/', router);

// uiPages
app.use('/app', (req: Request, res: Response, next: NextFunction) => {
	const action = req.originalUrl.split('/').at(2) ?? '404';
	req.action = action;
	const allowedRoutes = ['404', 'login', 'verifyEmail', 'categories', 'register'];
	if (!allowedRoutes.includes(action)) {
		return res.redirect('/');
	}
	const htmlPage = action?.concat('.html');
	try {
		return res.status(200).sendFile(path.join(process.cwd(), 'ui', htmlPage ?? '404.html'));
	} catch (err) {
		next(err);
	}
});


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(`Error occurred on action ${req.action}. Error: ${err}`);
	return res.status(500).send('Internal server error');
});

app.listen(config.get('server.port'), async () => {
	await postgres.init();
	console.log('Server is running');
});

