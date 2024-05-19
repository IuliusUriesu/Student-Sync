import { Decimal } from "@prisma/client/runtime/library";

export interface Student {
    id_student?: number;
    full_name: string;
    score: Decimal;
    bio: string;
}