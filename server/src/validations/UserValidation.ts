import { User } from "../domain/User";
import { InvalidUserError } from "../utils/errors";

export function validateUser(user: User) {
    const regex = /^[a-zA-Z0-9_]{3,}$/;
    if (!regex.test(user.username)) {
        throw new InvalidUserError('Invalid username. Username must contain at least 3 characters and can be composed of only letters, digits and underscores!');
    }

    const passwordErrorMessage = 'Invalid password. Password must contain at least 8 characters, at least one uppercase letter, ' + 
    'at least one lowercase letter, at least one digit and at least one special character!';

    if (user.password.length < 8 || user.password.length > 50) {
        throw new InvalidUserError(passwordErrorMessage);
    }

    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const digitRegex = /[0-9]/;
    const specialRegex = /[^A-Za-z0-9]/;
    if (!uppercaseRegex.test(user.password) || !lowercaseRegex.test(user.password) || !digitRegex.test(user.password) || !specialRegex.test(user.password)) {
        throw new InvalidUserError(passwordErrorMessage);
    }
}