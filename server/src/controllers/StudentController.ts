import { Router } from "express";
import * as service from "../services/StudentService";
import { BadRequestError, DuplicateEnrollmentError, ForeignKeyError, InvalidEnrollmentError, InvalidPageError, InvalidSortCriteria, InvalidStudentError, PageNotFoundError, StudentNotFoundError } from "../utils/Errors";
import { Student } from "../domain/Student";
import { Decimal } from "@prisma/client/runtime/library";
import { Enrollment } from "../domain/Enrollment";
import { validateDate, validateEnrollmentRequestBody, validateEnrollmentsRequestParams, validatePageRequest, validateStudentRequestBody, validateStudentRequestParams } from "../validations/StudentRequestValidation";
import { authorizationMiddleware } from "../middleware/authorizationMiddleware";
import { ExtendedRequest } from "../utils/ExtendedRequest";

export const studentRouter = Router();
studentRouter.use(authorizationMiddleware);

studentRouter.get('/', async (req: ExtendedRequest, res) => {
    try {
        const user = req.user;
        const students = await service.getAllStudents(user.id_user);
        res.status(200).send(students);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred!');
    }
});

studentRouter.get('/list/:id', async (req: ExtendedRequest, res) => {
    try {
        validateStudentRequestParams(req.params);
        const user = req.user;
        const id = parseInt(req.params.id);
        const student = await service.getStudent(user.id_user, id);
        res.status(200).send(student);
    }
    catch (error) {
        if (error instanceof StudentNotFoundError) {
            res.status(404).send(error.message);
        }
        else if (error instanceof BadRequestError) {
            res.status(400).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});

studentRouter.post('/', async (req: ExtendedRequest, res) => {
    try {
        validateStudentRequestBody(req.body);
        const user = req.user;
        const studentData: Student = {
            full_name: req.body.full_name,
            score: new Decimal(req.body.score),
            bio: req.body.bio
        };

        const addedStudent = await service.addStudent(user.id_user, studentData);
        res.status(200).send(addedStudent);
    }
    catch (error) {
        if (error instanceof InvalidStudentError || error instanceof BadRequestError) {
            res.status(400).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});

studentRouter.delete('/list/:id', async (req: ExtendedRequest, res) => {
    try {
        validateStudentRequestParams(req.params);
        const user = req.user;
        const id = parseInt(req.params.id);
        const deletedStudent = await service.deleteStudent(user.id_user, id);
        res.status(200).send(deletedStudent);
    }
    catch (error) {
        if (error instanceof StudentNotFoundError) {
            res.status(404).send(error.message);
        }
        else if (error instanceof BadRequestError) {
            res.status(400).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});

studentRouter.put('/list/:id', async (req: ExtendedRequest, res) => {
    try {
        validateStudentRequestParams(req.params);
        validateStudentRequestBody(req.body);
        const user = req.user;
        const id = parseInt(req.params.id);
        const studentData: Student = {
            full_name: req.body.full_name,
            score: new Decimal(req.body.score),
            bio: req.body.bio
        };
        const updatedStudent = await service.updateStudent(user.id_user, id, studentData);
        res.status(200).send(updatedStudent);
    }
    catch (error) {
        if (error instanceof StudentNotFoundError) {
            res.status(404).send(error.message);
        }
        else if (error instanceof InvalidStudentError || error instanceof BadRequestError) {
            res.status(400).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});

studentRouter.get('/pages/:pageNumber', async (req: ExtendedRequest, res) => {
    try {
        validatePageRequest(req);
        const user = req.user;
        const pageNumber = parseInt(req.params.pageNumber);

        let pageSize = 3;
        if (req.query.pageSize) {
            pageSize = Number(req.query.pageSize);
            if (isNaN(pageSize)) {
                pageSize = 0;
            }
        }

        let sortBy = 'id_student';
        if (req.query.sortBy) {
            sortBy = req.query.sortBy.toString();
        }

        let order = 'asc';
        if (req.query.order) {
            order = req.query.order.toString();
        }

        const studentPage = await service.getStudentPage(user.id_user, pageNumber, pageSize, sortBy, order);
        res.status(200).send(studentPage);
    }
    catch (error) {
        if (error instanceof InvalidPageError || error instanceof BadRequestError || error instanceof InvalidSortCriteria) {
            res.status(400).send(error.message);
        }
        else if (error instanceof PageNotFoundError) {
            res.status(404).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }   
    }
});

studentRouter.get('/pages', async (req: ExtendedRequest, res) => {
    try {
        const user = req.user;
        let pageSize = 3;
        if (req.query.pageSize) {
            pageSize = Number(req.query.pageSize);
            if (isNaN(pageSize)) {
                pageSize = 0;
            }
        }
        const pageCount = await service.getNumberOfPages(user.id_user, pageSize);
        res.status(200).json({ pageCount: pageCount });
    }
    catch (error) {
        if (error instanceof InvalidPageError) {
            res.status(400).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});

studentRouter.get('/passedFailedCount', async (req: ExtendedRequest, res) => {
    try {
        const user = req.user;
        const passedFailedCount = await service.getPassedFailedCount(user.id_user);
        res.status(200).send(passedFailedCount);
    }
    catch (error) {
        console.error(error);
        res.status(500).send('An unexpected error occurred!');
    }
});

studentRouter.get('/enrollments/:studentId', async (req: ExtendedRequest, res) => {
    try {
        validateEnrollmentsRequestParams(req.params);
        const user = req.user;
        const studentId = parseInt(req.params.studentId);
        const enrollments = await service.getEnrollments(user.id_user, studentId);
        res.status(200).send(enrollments);
    }
    catch (error) {
        if (error instanceof BadRequestError) {
            res.status(400).send(error.message);
        }
        else if (error instanceof StudentNotFoundError) {
            res.status(404).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});

studentRouter.post('/enrollments/:studentId', async (req: ExtendedRequest, res) => {
    try {
        validateEnrollmentsRequestParams(req.params);
        validateEnrollmentRequestBody(req.body);
        validateDate(req.body.enrollment_date);
        const user = req.user;
        const studentId = parseInt(req.params.studentId);
        const enrollmentData: Enrollment = {
            id_student: studentId,
            course_name: req.body.course_name,
            enrollment_date: new Date(req.body.enrollment_date),
            grade: new Decimal(req.body.grade),
        };
        const addedEnrollment = await service.addEnrollment(user.id_user, enrollmentData);
        res.status(200).send(addedEnrollment);
    }
    catch (error) {
        if (error instanceof InvalidEnrollmentError || error instanceof BadRequestError || error instanceof ForeignKeyError) {
            res.status(400).send(error.message);
        }
        else if (error instanceof DuplicateEnrollmentError) {
            res.status(409).send(error.message);
        }
        else if (error instanceof StudentNotFoundError) {
            res.status(404).send(error.message);
        }
        else {
            console.error(error);
            res.status(500).send('An unexpected error occurred!');
        }
    }
});