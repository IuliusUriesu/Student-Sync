import { InvalidStudentError } from "./errors";

export interface Student {
    id_student?: number;
    full_name: string;
    score: number;
    bio: string;
}

export function getDefaultStudent(): Student {
    const defaultStudent: Student = {
        full_name: "Full Name",
        score: 7.89,
        bio: "This is my bio"
    }
    return defaultStudent;
}

export function validateStudent(student: Student): void {
    const regex = /^[A-Z][a-z]{1,20} [A-Z][a-z]{1,20}$/;
    if (!regex.test(student.full_name)) {
        throw new InvalidStudentError('Invalid name format. Name must be exactly two words, each starting with a capital letter and at least two characters');
    }

    if (student.score < 0 || student.score > 10) {
        throw new InvalidStudentError('Invalid score. Score must be between 0.00 and 10.00');
    }

    if (student.bio.length < 3 || student.bio.length > 200) {
        throw new InvalidStudentError('Invalid bio. Bio must contain at least 3 characters and no more than 200 characters');
    }
}