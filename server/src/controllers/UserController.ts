import { Router } from "express";
import * as service from "../services/UserService";
import { validateUserRequestBody } from "../validations/UserRequestValidation";
import { User } from "../domain/User";
import { AuthenticationError, BadRequestError, DuplicateUserError, InternalServerError, InvalidRefreshTokenError, InvalidUserError, UserNotFoundError } from "../utils/errors";
import jwt from "jsonwebtoken";
import { UserDTO } from "../domain/UserDTO";

export const userRouter = Router();

function generateAccessToken(user: UserDTO): string {
    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessTokenSecret) {
        throw new InternalServerError('ACCESS_TOKEN_SECRET is not defined in the .env file!');
    }
    return jwt.sign(user, accessTokenSecret, { expiresIn: '5m' });
}

userRouter.get('/', async (req, res) => {
    try {
        const users = await service.getAllUsers();
        res.status(200).send(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred!');
    }
});

userRouter.post('/', async (req, res) => {
    try {
        validateUserRequestBody(req.body);
        const user: User = {
            id_user: 0,
            username: req.body.username,
            password: req.body.password,
        };
        const addedUser = await service.addUser(user);
        res.status(200).send(addedUser);
    }
    catch (error) {
        if (error instanceof BadRequestError || error instanceof InvalidUserError) {
            res.status(400).send(error.message);
        }
        else if (error instanceof DuplicateUserError) {
            res.status(409).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});

userRouter.post('/login', async (req, res) => {
    try {
        validateUserRequestBody(req.body);

        // Authenticate User
        const userData: User = {
            id_user: 0,
            username: req.body.username,
            password: req.body.password,
        };
        const foundUser = await service.authenticateUser(userData);

        const user: UserDTO = {
            id_user: foundUser.id_user,
            username: foundUser.username,
        };

        const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
        if (!refreshTokenSecret) {
            throw new InternalServerError('REFRESH_TOKEN_SECRET is not defined in the .env file!');
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = jwt.sign(user, refreshTokenSecret, { expiresIn: '1d' });

        await service.storeRefreshToken(user.id_user, refreshToken);

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            path: '/',
            sameSite: 'lax',
        });

        res.status(200).send({ accessToken: accessToken, user: user });
    }
    catch (error) {
        if (error instanceof BadRequestError) {
            res.status(400).send(error.message);
        }
        else if (error instanceof AuthenticationError) {
            res.status(401).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});

userRouter.post('/token', async (req, res) => {
    const refreshToken: string = req.cookies['refreshToken'];
    if (!refreshToken) {
        console.error('Refresh token cookie error');
        return res.status(500).send('An unexpected error occurred!');
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
    if (!refreshTokenSecret) {
        console.error('REFRESH_TOKEN_SECRET is not defined in the .env file!');
        return res.status(500).send('An unexpected error occurred!');
    }

    jwt.verify(refreshToken, refreshTokenSecret, async (error, user) => {
        if (error) {
            return res.status(403).send('Invalid refresh token!');
        }

        user = user as jwt.JwtPayload;
        try {
            await service.validateRefreshToken(user.id_user, refreshToken);
        }
        catch (error) {
            if (error instanceof InvalidRefreshTokenError) {
                return res.status(403).send(error.message);
            }
            else {
                console.error(error);
                return res.status(500).send('An unexpected error occurred!');
            }
        }
        
        const accessToken = generateAccessToken({ id_user: user.id_user, username: user.username });
        res.status(200).json({ accessToken: accessToken });
    });
});

userRouter.delete('/logout/:userId', async (req, res) => {
    try {
        const userId = parseInt(req.params.userId);
        if (isNaN(userId)) {
            return res.status(400).send('Parameter \'userId\' must be a positive integer!')
        }

        await service.deleteRefreshToken(userId);
        res.status(200).send('User logged out successfully!');
    }
    catch (error) {
        if (error instanceof UserNotFoundError) {
            res.status(404).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});