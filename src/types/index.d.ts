// This module is to extend the functionality of Express
export {}

export type User = {
    user_id: number,
    user_name: string,
    email: string
}

declare global {
  namespace Express {
    export interface Request {
      action?: string;
			user?: User;
    }
  }
}
