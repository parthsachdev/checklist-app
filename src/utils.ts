import config from 'config';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { User } from './types';
import { NextFunction, Request, Response } from 'express';

export function hashPassword(password: string): string {
	const salt = config.get('auth.salt') as string;
	const iterations = config.get('auth.iterations') as number;
	const keylen = config.get('auth.keylen') as number;
	const digest = config.get('auth.digest') as string;
	return crypto.pbkdf2Sync(password, salt, iterations, keylen, digest).toString('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
	return hash === hashPassword(password);
}

export function generateJWT(user: User): {token: string, expiresIn: number} {
	const secret = config.get('auth.jwtSecret') as string;
	const expiry = config.get('auth.jwtExpiry') as number;
	return {
		token: jwt.sign(user as Object, secret, {expiresIn: expiry}),
		expiresIn: expiry
	};
}

export function decodeJWTFromHeader(req: Request, res: Response, next: NextFunction): Response | void {
	const authHeader = req.header('Authorization');
	if (!authHeader) {
		return res.status(400).json({message: 'Authorization header invalid'});
	}
	const parts = authHeader.split(' ');
	if (parts.length !== 2) {
		return res.status(400).json({message: 'Authorization header invalid'});
	}
	const token = parts[1];
	const userObj = jwt.decode(token, {complete: true}) as jwt.JwtPayload;
	if (!userObj) {
		return res.status(400).json({message: 'Token invalid'});
	}
	req.user = {
		user_id: userObj.payload.user_id,
		user_name: userObj.payload.user_name,
		email: userObj.payload.email
	};
	next();
}

export function verifyOTP(otp: number): boolean {
	return otp === config.get('auth.otp');
}