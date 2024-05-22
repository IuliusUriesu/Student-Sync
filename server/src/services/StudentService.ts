import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../utils/PrismaClient";
import { DuplicateEnrollmentError, ForeignKeyError, InternalServerError, InvalidEnrollmentError, InvalidPageError, InvalidSortCriteria, InvalidStudentError, PageNotFoundError, StudentNotFoundError } from "../utils/errors";
import { Student } from "../domain/Student";
import { Enrollment } from "../domain/Enrollment";
import { validateEnrollment, validatePage, validateSortCriteria, validateStudent } from "../validations/StudentValidation";

export async function getAllStudents(id_user: number): Promise<Student[]> {
    try {
        const students = await prisma.students.findMany({
            select: {
                id_student: true,
                full_name: true,
                score: true,
                bio: true,
            },
            where: {
                id_user: id_user,
            },
        });
        return students;
    }
    catch (error) {
        throw new InternalServerError((error as Error).message);
    }
}

export async function getStudent(id_user: number, id_student: number): Promise<Student> {
    let student = null;
    try {
        student = await prisma.students.findUnique({
            select: {
                id_student: true,
                full_name: true,
                score: true,
                bio: true,
            },
            where: {
                id_user: id_user,
                id_student: id_student,
            },
        });
    }
    catch (error) {
        throw new InternalServerError((error as Error).message);
    }

    if (student === null) {
        throw new StudentNotFoundError(`Student with id = ${id_student} was not found!`);
    }
    return student;
}

export async function addStudent(id_user: number, studentData: Student): Promise<Student> {
    try {
        validateStudent(studentData);
        const student = await prisma.students.create({
            data: {
                id_user: id_user,
                full_name: studentData.full_name,
                score: studentData.score,
                bio: studentData.bio,
            },
        });

        return student;
    }
    catch (error) {
        if (error instanceof InvalidStudentError) {
            throw error;
        }
        else {
            throw new InternalServerError((error as Error).message);
        }
    }
}

export async function deleteStudent(id_user: number, id_student: number): Promise<Student> {
    try {
        const student = await prisma.students.delete({
            where: {
                id_user: id_user,
                id_student: id_student,
            },
        });

        return student;
    }
    catch (error) {
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new StudentNotFoundError(`Student with id = ${id_student} was not found!`);
        }
        else {
            throw new InternalServerError((error as Error).message);
        }
    }
}

export async function updateStudent(id_user: number, id_student: number, studentData: Student): Promise<Student> {
    try {
        validateStudent(studentData);
        const student = await prisma.students.update({
            where: {
                id_user: id_user,
                id_student: id_student,
            },
            data: {
                full_name: studentData.full_name,
                score: studentData.score,
                bio: studentData.bio,
            },
        });

        return student;
    }
    catch (error) {
        if (error instanceof InvalidStudentError) {
            throw error;
        }
        else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
            throw new StudentNotFoundError(`Student with id = ${id_student} was not found!`);
        }
        else {
            throw new InternalServerError((error as Error).message);
        }
    }   
}

export async function getStudentPage(id_user: number, pageNumber: number, pageSize: number = 3, sortBy: string = 'id_student', order: string = 'asc'): Promise<Student[]> {
    try {
        validatePage(pageNumber, pageSize);
        validateSortCriteria(sortBy, order);
        const students = await prisma.students.findMany({
            select: {
                id_student: true,
                full_name: true,
                score: true,
                bio: true,
            },
            where: {
                id_user: id_user,
            },
            skip: pageSize * (pageNumber - 1),
            take: pageSize,
            orderBy: {
                [sortBy]: order,
            },  
        });

        if (students.length === 0) {
            throw new PageNotFoundError(`Student page ${pageNumber} was not found!`);
        }

        return students;
    }
    catch (error) {
        if (error instanceof InvalidPageError || error instanceof PageNotFoundError || error instanceof InvalidSortCriteria) {
            throw error;
        }
        else {
            throw new InternalServerError((error as Error).message);
        }   
    }
}

export async function getNumberOfPages(id_user: number, pageSize: number = 3): Promise<number> {
    if (pageSize <= 0) {
        throw new InvalidPageError('Invalid page size. Page size must be a positive integer!');
    }

    try {
        const studentCount = await prisma.students.count({
            where: {
                id_user: id_user,
            },
        });
        return Math.ceil(studentCount / pageSize);
    }
    catch (error) {
        throw new InternalServerError((error as Error).message);
    }
}

export async function getPassedFailedCount(id_user: number): Promise<{passedCount: number, failedCount: number}> {
    try {
        const passed = await prisma.students.count({
            where: {
                id_user: id_user,
                score: {
                    gte: 5,
                },
            },
        });

        const failed = await prisma.students.count({
            where: {
                id_user: id_user,
                score: {
                    lt: 5,
                },
            },
        });

        return {
            passedCount: passed,
            failedCount: failed,
        };
    }
    catch (error) {
        throw new InternalServerError((error as Error).message);
    }
}

export async function getEnrollments(id_user: number, id_student: number): Promise<Enrollment[]> {
    try {
        const student = await prisma.students.findUnique({
            where: {
                id_user: id_user,
                id_student: id_student,
            },
        });

        if (student === null) {
            throw new StudentNotFoundError(`Student with id = ${id_student} was not found!`);
        }

        const enrollments = await prisma.enrollments.findMany({
            where: {
                id_student: id_student,
            },
        });

        return enrollments;
    }
    catch (error) {
        if (error instanceof StudentNotFoundError) {
            throw error;
        }
        else {
            throw new InternalServerError((error as Error).message);
        }   
    }
}

export async function addEnrollment(id_user: number, enrollmentData: Enrollment): Promise<Enrollment> {
    try {
        validateEnrollment(enrollmentData);

        const student = await prisma.students.findUnique({
            where: {
                id_user: id_user,
                id_student: enrollmentData.id_student,
            },
        });

        if (student === null) {
            throw new StudentNotFoundError(`Student with id = ${enrollmentData.id_student} was not found!`);
        }

        const counter = await prisma.enrollments.count({
            where: {
                id_student: enrollmentData.id_student,
                course_name: enrollmentData.course_name,
            },
        });

        if (counter > 0) {
            throw new DuplicateEnrollmentError(`An enrollment of this student for the course ${enrollmentData.course_name} already exists!`);
        }

        const enrollment = await prisma.enrollments.create({
            data: {
                id_student: enrollmentData.id_student,
                course_name: enrollmentData.course_name,
                enrollment_date: enrollmentData.enrollment_date,
                grade: enrollmentData.grade,
            },
        });
        
        return enrollment;
    }
    catch (error) {
        if (error instanceof InvalidEnrollmentError || error instanceof DuplicateEnrollmentError || error instanceof StudentNotFoundError) {
            throw error;
        }
        else if (error instanceof PrismaClientKnownRequestError && error.code === 'P2003') {
            throw new ForeignKeyError(`Foreign key constraint failed: there is no student with id = ${enrollmentData.id_student}!`);
        }
        else {
            throw new InternalServerError((error as Error).message);
        }
    }
}

export async function getEnrollmentPage(id_user: number, id_student: number, pageNumber: number, pageSize: number = 100): Promise<Enrollment[]> {
    try {
        validatePage(pageNumber, pageSize);

        const student = await prisma.students.findUnique({
            where: {
                id_user: id_user,
                id_student: id_student,
            },
        });
    
        if (student === null) {
            throw new StudentNotFoundError(`Student with id = ${id_student} was not found!`);
        }

        const enrollments = await prisma.enrollments.findMany({
            where: {
                id_student: id_student,
            },
            skip: pageSize * (pageNumber - 1),
            take: pageSize,
        });

        if (enrollments.length === 0) {
            throw new PageNotFoundError(`Enrollments page ${pageNumber} was not found!`);
        }

        return enrollments;
    }
    catch (error) {
        if (error instanceof StudentNotFoundError || error instanceof InvalidPageError || error instanceof PageNotFoundError) {
            throw error;
        }
        else {
            throw new InternalServerError((error as Error).message);
        }
    }
}