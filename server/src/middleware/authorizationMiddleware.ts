import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ExtendedRequest } from "../utils/ExtendedRequest";

export function authorizationMiddleware(req: ExtendedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).send('Authorization header is required!');
    }

    const token = authHeader.split(' ')[1];
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        console.error('ACCESS_TOKEN_SECRET is not defined in the .env file!');
        return res.status(500).send('An unexpected error occurred!');
    }

    jwt.verify(token, accessTokenSecret, (error, user) => {
        if (error) {
            return res.status(403).send('Invalid token!');
        }

        req.user = user;
        next();
    });
}