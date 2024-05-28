import { useEffect, useState } from "react";
import { Enrollment } from "../utils/enrollment";
import { dataApi } from "../utils/api/dataApi";
import InfiniteScroll from "react-infinite-scroll-component";
import axios, { AxiosError, CancelTokenSource } from "axios";

interface EnrollmentsTableProps {
  studentId: number;
}

function EnrollmentsTable({ studentId }: EnrollmentsTableProps) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    //console.log("EnrollmentsTable mounted");
    const source = axios.CancelToken.source();
    fetchEnrollments(source);

    return () => {
      //console.log("EnrollmentsTable umounts...");
      source.cancel("Request canceled");
    };
  }, []);

  const fetchEnrollments = async (source?: CancelTokenSource) => {
    //console.log("Fetching...");
    dataApi
      .get(
        `/api/students/enrollments/pages/${studentId}?page=${page}&size=20`,
        {
          cancelToken: source?.token,
        }
      )
      .then((res) => {
        if (!res) {
          return;
        }

        const enrollmentPage: Enrollment[] = [];
        for (const enrollment of res.data.page) {
          enrollmentPage.push({
            ...enrollment,
            enrollment_date: new Date(enrollment.enrollment_date),
          });
        }

        //console.log(enrollmentPage);
        //console.log("Done fetching");

        setEnrollments((prevState) => [...prevState, ...enrollmentPage]);
        setPage((prevState) => prevState + 1);
        setHasMore(!res.data.last);
      })
      .catch((error: AxiosError) => {
        console.log(error);
        if (error.response?.status === 404) {
          setHasMore(false);
        }
      });
  };

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
    //console.log(`Enrollment ID: ${enrollment.id_enrollment}`);

    const day = enrollment.enrollment_date.getDate();
    const month = enrollment.enrollment_date.getMonth();
    const year = enrollment.enrollment_date.getFullYear();
    const formattedDate: string = `${months[month]} ${day}, ${year}`;

    return (
      <div key={enrollment.id_enrollment} className="table-row">
        <div className="table-cell w-2/5">{enrollment.course_name}</div>
        <div className="table-cell w-1/3">{formattedDate}</div>
        <div className="table-cell w-1/5">{enrollment.grade}</div>
      </div>
    );
  });

  return (
    <div className="mx-auto my-16 divide-y-2 divide-sky-500 bg-white w-2/3 shadow-lg">
      <div className="bg-sky-500 sticky top-0 z-10 table-row">
        <div className="table-header w-2/5">Course Name</div>
        <div className="table-header w-1/3">Enrollment Date</div>
        <div className="table-header w-1/5">Grade</div>
      </div>

      <InfiniteScroll
        dataLength={enrollments.length}
        next={() => fetchEnrollments()}
        hasMore={hasMore}
        loader={
          <div className="py-2 text-center border-t-sky-500 border-t-2 font-semibold">
            Loading...
          </div>
        }
      >
        <div className="divide-y-2 divide-sky-500">{tableRows}</div>
      </InfiniteScroll>
    </div>
  );
}

export default EnrollmentsTable;
