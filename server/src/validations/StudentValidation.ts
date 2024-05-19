import { Enrollment } from "../domain/Enrollment";
import { InvalidStudentError, InvalidPageError, InvalidSortCriteria, InvalidEnrollmentError } from "../utils/Errors";
import { Student } from "../domain/Student";

export function validateStudent(student: Student): void {
    const regex = /^[A-Z][a-z]{1,20} [A-Z][a-z]{1,20}$/;
    if (!regex.test(student.full_name)) {
        throw new InvalidStudentError('Invalid name format. Name must be exactly two words, each starting with a capital letter and at least two characters!');
    }

    if (student.score.toNumber() < 0 || student.score.toNumber() > 10) {
        throw new InvalidStudentError('Invalid score. Score must be between 0.00 and 10.00!');
    }

    if (student.bio.length < 3 || student.bio.length > 200) {
        throw new InvalidStudentError('Invalid bio. Bio must contain at least 3 characters and no more than 200 characters!');
    }
}

export function validatePage(pageNumber: number, pageSize: number): void {
    if (pageNumber <= 0) {
        throw new InvalidPageError('Invalid page number. Page number must be a positive integer!');
    }

    if (pageSize <= 0) {
        throw new InvalidPageError('Invalid page size. Page size must be a positive integer!');
    }
}

export function validateSortCriteria(sortBy: string, order: string) {
    if (sortBy !== 'id_student' && sortBy !== 'full_name' && sortBy !== 'score') {
        throw new InvalidSortCriteria('Invalid sort criteria. Sort criteria must be \'id_student\', \'full_name\' or \'score\'!');
    }

    if (order !== 'asc' && order !== 'desc') {
        throw new InvalidSortCriteria('Invalid order. Order must be \'asc\' or \'desc\'!');
    }
}

export function validateEnrollment(enrollment: Enrollment) {
    if (enrollment.grade.toNumber() < 0 || enrollment.grade.toNumber() > 10) {
        throw new InvalidEnrollmentError('Invalid grade. Grade must be between 0.00 and 10.00!');
    }

    if (enrollment.course_name.length < 3 || enrollment.course_name.length > 100) {
        throw new InvalidEnrollmentError('Invalid course name. Course name must contain at least 3 characters and no more than 100 characters!');
    }

    if (enrollment.enrollment_date < new Date('2021-01-01') || enrollment.enrollment_date > new Date('2024-12-31')) {
        throw new InvalidEnrollmentError('Invalid enrollment date. Enrollment date must be between January 1st, 2021 and December 31st, 2024!');
    }
}