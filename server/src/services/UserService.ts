import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { User } from "../domain/User";
import { AuthenticationError, DuplicateUserError, InternalServerError, InvalidRefreshTokenError, InvalidUserError, UserNotFoundError } from "../utils/Errors";
import { prisma } from "../utils/PrismaClient";
import { validateUser } from "../validations/UserValidation";
import bcrypt from "bcrypt";

export async function getAllUsers(): Promise<User[]> {
    try {
        const users = await prisma.users.findMany();
        return users;
    }
    catch (error) {
        throw new InternalServerError((error as Error).message);
    }
}

export async function addUser(userData: User): Promise<User> {
    try {
        validateUser(userData);

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const user =  await prisma.users.create({
            data: {
                username: userData.username,
                password: hashedPassword,
            },
        });

        return user;
    }
    catch (error) {
        if (error instanceof InvalidUserError) {
            throw error;
        }
        else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
            throw new DuplicateUserError(`A user with the username '${userData.username}' already exists!`);
        }
        else {
            throw new InternalServerError((error as Error).message);
        }
    }
}

export async function authenticateUser(userData: User): Promise<User> {
    try {
        const foundUser = await prisma.users.findUnique({
            where: {
                username: userData.username,
            },
        });

        if (foundUser === null) {
            throw new AuthenticationError('Username and password do not match!');
        }

        if (await bcrypt.compare(userData.password, foundUser.password)) {
            return foundUser;
        }
        else {
            throw new AuthenticationError('Username and password do not match!');
        }
    }
    catch (error) {
        if (error instanceof AuthenticationError) {
            throw error;
        }
        else {
            throw new InternalServerError((error as Error).message);
        }
    }
}

export async function storeRefreshToken(id_user: number, refresh_token: string): Promise<void> {
    try {
        const salt = await bcrypt.genSalt();
        const hashedRefreshToken = await bcrypt.hash(refresh_token, salt);

        const user = await prisma.users.update({
            where: {
                id_user: id_user,
            },
            data: {
                refresh_token: hashedRefreshToken,
            },
        });
    }
    catch (error) {
        throw new InternalServerError((error as Error).message);
    }
}

export async function validateRefreshToken(id_user: number, refresh_token: string): Promise<void> {
    try {
        const hashedRefreshToken = await prisma.users.findUnique({
            select: {
                refresh_token: true,
            },
            where: {
                id_user: id_user,
            },
        });

        if (!hashedRefreshToken || !hashedRefreshToken.refresh_token) {
            throw new InvalidRefreshTokenError('Invalid refresh token!');
        }

        const ok: boolean = await bcrypt.compare(refresh_token, hashedRefreshToken.refresh_token);
        if (!ok) {
            throw new InvalidRefreshTokenError('Invalid refresh token!');
        }
    }
    catch (error) {
        if (error instanceof InvalidRefreshTokenError) {
            throw error;
        }
        throw new InternalServerError((error as Error).message);
    }
}

export async function deleteRefreshToken(id_user: number): Promise<void> {
    try {
        const user = await prisma.users.findUnique({
            where: {
                id_user: id_user,
            },
        });

        if (user === null) {
            throw new UserNotFoundError(`User with id = ${id_user} was not found!`);
        }

        await prisma.users.update({
            where: {
                id_user: id_user,
            },
            data: {
                refresh_token: null,
            },
        });
    }
    catch (error) {
        if (error instanceof UserNotFoundError) {
            throw error;
        } 
        else {
            throw new InternalServerError((error as Error).message);
        }
    }
}