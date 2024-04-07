import express, {Express} from 'express';
import {router} from './src/router';
import * as postgres from './src/postgres';
import { NextFunction, Request, Response } from "express";
import config from 'config';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req: Request, res: Response, next: NextFunction) => {
	console.log(`Request received for ${req.method} ${req.url}`);
	next();
});
app.use('/', router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
	console.error(`Error occurred on action ${req.action}. Error: ${err}`);
	return res.status(500).send('Internal server error');
});

app.listen(config.get('server.port'), async () => {
	await postgres.init();
	console.log('Server is running');
});

