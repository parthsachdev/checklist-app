import { Request, Response, NextFunction } from 'express';
import path from 'path';
export async function loginPage(req: Request, res: Response, next: NextFunction) {
	req.action = 'loginPage';
	try {
		return res.status(200).sendFile(path.join(process.cwd(), 'ui', 'login.html'));
	} catch (err) {
		next(err);
	}
}

export async function registerPage(req: Request, res: Response, next: NextFunction) {
	req.action = 'registerPage';
	try {
		return res.status(200).sendFile(path.join(process.cwd(), 'ui', 'register.html'));
	} catch (err) {
		next(err);
	}
}

export async function categoriesPage(req: Request, res: Response, next: NextFunction) {
	req.action = 'categoriesPage';
	try {
		return res.status(200).sendFile(path.join(process.cwd(), 'ui', 'categories.html'));
	} catch (err) {
		next(err);
	}
}
