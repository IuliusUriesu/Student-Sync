import { useEffect, useState } from "react";
import { Enrollment } from "../utils/enrollment";
import { dataApi } from "../utils/api/dataApi";

interface EnrollmentsTableProps {
  studentId: number;
}

function EnrollmentsTable({ studentId }: EnrollmentsTableProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const fetchEnrollments = () => {
      dataApi
        .get(`/api/students/enrollments/${studentId}`)
        .then((res) => {
          const enrollmentList: Enrollment[] = [];
          for (const enrollment of res.data) {
            enrollmentList.push({
              ...enrollment,
              enrollment_date: new Date(enrollment.enrollment_date),
            });
          }
          setEnrollments(enrollmentList);
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchEnrollments();
  }, [studentId]);

  const months: string[] = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const tableRows = enrollments.map((enrollment) => {
    const day = enrollment.enrollment_date.getDate();
    const month = enrollment.enrollment_date.getMonth();
    const year = enrollment.enrollment_date.getFullYear();
    const formattedDate: string = `${months[month]} ${day}, ${year}`;

    return (
      <tr key={enrollment.id_enrollment}>
        <td className="table-cell">{enrollment.course_name}</td>
        <td className="table-cell">{formattedDate}</td>
        <td className="table-cell">{enrollment.grade}</td>
      </tr>
    );
  });

  return (
    <table className="mx-auto my-16 divide-y-2 divide-sky-500 bg-white w-2/3 shadow-lg">
      <thead className="bg-sky-500 sticky top-0 z-10">
        <tr>
          <th className="table-header">Course Name</th>
          <th className="table-header">Enrollment Date</th>
          <th className="table-header">Grade</th>
        </tr>
      </thead>

      <tbody className="divide-y-2 divide-sky-500">{tableRows}</tbody>
    </table>
  );
}

export default EnrollmentsTable;
