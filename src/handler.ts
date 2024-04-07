import { NextFunction, Request, Response } from "express";
import { getClient, queries } from "./postgres";

import * as utils from "./utils";
import format from 'pg-format';

export async function login(req: Request, res: Response, next: NextFunction) {
	req.action = 'login';
	try {
		const { email, password }: {email: string, password: string} = req.body;

		if (!email || !password) {
			return res.status(400).send('Invalid username or password');
		}

		const client = getClient();

		const response = await client.query(queries['get_user_details'], [email]);

		if (response.rows.length !== 1) {
			return res.status(401).json({message: 'Invalid username or password'});
		}

		const user = response.rows[0];

		if (!user.verified) {
			return res.status(403).json({message: 'Email not verified'});
		}

		const passhash = user.passhash;
		if (!utils.verifyPassword(password, passhash)) {
			return res.status(401).json({message: 'Invalid username or password'});
		}

		// Generate JWT token
		const jwt = utils.generateJWT({user_id: user.user_id, user_name: user.user_name, email: user.email});

		return res.status(200).json({message: 'Login OK!', token: jwt.token, expiresIn: jwt.expiresIn});
	} catch (err) {
		next(err);
	}

}

export async function register(req: Request, res: Response, next: NextFunction) {
	req.action = 'register';
	try {
		const {name, email, password}: {name: string, email: string, password: string} = req.body;

		if (!name || !email || !password) {
			return res.status(400).send('Invalid input');
		}

		const client = getClient();

		const passhash = utils.hashPassword(password);

		const obj = await client.query(queries['register_user'], [email, passhash, name]);

		return res.status(201).json({message: 'OTP sent to mail successfully'});

	} catch (err) {
		next(err);
	}

}

export async function verifyEmail(req: Request, res: Response, next: NextFunction) {
	req.action = 'verifyEmail';
	try {
		const {code} = req.body;
		const client = getClient();
		const user = req.user;
		if (utils.verifyOTP(code)) {
			await client.query(queries['verify_user'], [`${user?.user_id}`]);
			return res.status(200).json({'message': 'Email verified successfully'});
		} else {
			return res.status(401).json({'message': 'Invalid OTP'});
		}
	} catch (err) {
		console.error(`Error occurred on action ${req.action}. Error: ${err}`);
		next(err);
	}
}

export async function getCategories(req: Request, res: Response, next: NextFunction) {
	req.action = 'getCategories';
	try {
		const client = getClient();
		const user = req.user;
		const response = await client.query(queries['get_categories_for_user'], [`${user?.user_id}`]);
		return res.status(200).json({message: 'Categories', data: response.rows});
	} catch (err) {
		next(err);
	}
}

export async function updateCheckList(req: Request, res: Response, next: NextFunction) {
	req.action = 'updateCheckList';
	try {
		const {checkList} = req.body;
		const client = getClient();
		const user = req.user;
		await client.query(queries['delete_checklist_for_user'], [`${user?.user_id}`]);
		const result = await client.query(format(queries['update_checklist_for_user'], checkList.map((item: number) => [user?.user_id, item])));
		return res.status(200).json({message: 'Checklist updated successfully', data: result.rows});
	} catch (err) {
		next(err);
	}
}
