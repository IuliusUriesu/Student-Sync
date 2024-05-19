import { Decimal } from "@prisma/client/runtime/library";

export interface Enrollment {
    id_enrollment?: number;
    id_student: number;
    course_name: string;
    enrollment_date: Date;
    grade: Decimal;
}