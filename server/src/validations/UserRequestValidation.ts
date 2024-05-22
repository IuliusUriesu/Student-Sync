import { BadRequestError } from "../utils/errors";

export function validateUserRequestBody(body: any) {
    const correctKeys = ['username', 'password'];
    const keys = Object.keys(body);
    
    correctKeys.forEach(key => {
        if (!keys.includes(key)) {
            throw new BadRequestError(`Property '${key}' is required!`);
        }
    });

    if (keys.length > correctKeys.length) {
        throw new BadRequestError('Request body must contain only properties: \'full_name\', \'score\' and \'bio\'!');
    }

    if (typeof body.username !== 'string') {
        throw new BadRequestError('Property \'username\' must be a string!');
    }

    if (typeof body.password !== 'string') {
        throw new BadRequestError('Property \'password\' must be a string!');
    }
}