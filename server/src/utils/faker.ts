import { Decimal } from "@prisma/client/runtime/library";
import { Student } from "../domain/Student";
import { en, faker } from "@faker-js/faker";
import { Enrollment } from "../domain/Enrollment";
import { prisma } from "./PrismaClient";

function generateStudent(): Student {
    const student: Student = {
        full_name: faker.person.fullName(),
        score: new Decimal(faker.number.float({
            min: 0.0,
            max: 10.0,
            fractionDigits: 2,
        })),
        bio: faker.lorem.sentence(),
    };

    return student;
}

function generateEnrollment(id_student: number): Enrollment {
    const enrollment: Enrollment = {
        id_student: id_student,
        course_name: faker.lorem.words({ min: 1, max: 4 }),
        enrollment_date: faker.date.between({ from: '2021-01-01', to: '2024-12-31' }),
        grade: new Decimal(faker.number.float({
            min: 0.0,
            max: 10.0,
            fractionDigits: 2,
        })),
    };

    return enrollment;
}

function generateRandomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}

export async function insertData() {
    const id_user = 28;

    const studentCount = 200;
    for (let i = 0; i < studentCount; i++) {
        const student = generateStudent();
        const insertedStudent = await prisma.students.create({
            data: {
                id_user: id_user,
                full_name: student.full_name,
                score: student.score,
                bio: student.bio,
            },
            select: {
                id_student: true,
            }
        });

        const studentId = insertedStudent.id_student;
        const enrollmentCount = generateRandomInt(10000, 30000);
        for (let j = 0; j < enrollmentCount; j++) {
            const enrollment = generateEnrollment(studentId);
            try {
                await prisma.enrollments.create({
                    data: {
                        id_student: studentId,
                        course_name: enrollment.course_name,
                        enrollment_date: enrollment.enrollment_date,
                        grade: enrollment.grade,
                    },
                });
            }
            catch (error) {
                console.error(error);
            }

            if ((j + 1) % 1000 === 0) {
                console.log(`Enrollments inserted: ${j + 1} / ${enrollmentCount}`);
            }
        }

        console.log(`Students inserted: ${i + 1} / ${studentCount}\n`);
    }
}