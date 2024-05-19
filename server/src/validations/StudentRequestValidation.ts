import { isValid, parse } from "date-fns";
import { BadRequestError } from "../utils/Errors";

export function validateStudentRequestBody(body: any) {
    const correctKeys = ['full_name', 'score', 'bio'];
    const keys = Object.keys(body);
    
    correctKeys.forEach(key => {
        if (!keys.includes(key)) {
            throw new BadRequestError(`Property '${key}' is required!`);
        }
    });

    if (keys.length > correctKeys.length) {
        throw new BadRequestError('Request body must contain only properties: \'full_name\', \'score\' and \'bio\'!');
    }

    if (typeof body.full_name !== 'string') {
        throw new BadRequestError('Property \'full_name\' must be a string!');
    }

    if (typeof body.score !== 'number') {
        throw new BadRequestError('Property \'score\' must be a number!')
    }

    if (typeof body.bio !== 'string') {
        throw new BadRequestError('Property \'bio\' must be a string!');
    }
}

export function validateStudentRequestParams(params: any) {
    if (!params.id) {
        throw new BadRequestError('Parameter \'id\' is required!');
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
        throw new BadRequestError('Parameter \'id\' must be a positive integer!');
    }
}

export function validatePageRequest(req: any) {
    if (!req.params.pageNumber) {
        throw new BadRequestError('Parameter \'pageNumber\' is required!');
    }

    const pageNumber = parseInt(req.params.pageNumber);
    if (isNaN(pageNumber)) {
        throw new BadRequestError('Parameter \'pageNumber\' must be a positive integer!');
    }
}

export function validateEnrollmentsRequestParams(params: any) {
    if (!params.studentId) {
        throw new BadRequestError('Parameter \'studentId\' is required!');
    }

    const studentId = parseInt(params.studentId);
    if (isNaN(studentId)) {
        throw new BadRequestError('Parameter \'studentId\' must be a positive integer!');
    }
}

export function validateEnrollmentRequestBody(body: any) {
    const correctKeys = ['course_name', 'enrollment_date', 'grade'];
    const keys = Object.keys(body);
    
    correctKeys.forEach(key => {
        if (!keys.includes(key)) {
            throw new BadRequestError(`Property '${key}' is required!`);
        }
    });

    if (keys.length > correctKeys.length) {
        throw new BadRequestError('Request body must contain only properties: \'course_name\', \'enrollment_date\' and \'grade\'!');
    }

    if (typeof body.course_name !== 'string') {
        throw new BadRequestError('Property \'course_name\' must be a string!');
    }

    const regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/;
    if (typeof body.enrollment_date !== 'string' || !regex.test(body.enrollment_date)) {
        throw new BadRequestError('Property \'enrollment_date\' must respect the format yyyy-mm-dd!');
    }

    if (typeof body.grade !== 'number') {
        throw new BadRequestError('Property \'grade\' must be a number!');
    }
}

export function validateDate(dateString: string) {
    const date = parse(dateString, 'yyyy-MM-dd', new Date());
    if (!isValid(date)) {
        throw new BadRequestError('Invalid date. Date must be a real date!');
    }
}