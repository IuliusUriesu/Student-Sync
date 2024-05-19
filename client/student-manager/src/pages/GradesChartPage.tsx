import { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import PageTitle from "../components/PageTitle";
import { dataApi } from "../utils/api/dataApi";

function GradesChartPage() {
  const [chartData, setChartData] = useState({
    passedCount: 0,
    failedCount: 0,
  });

  useEffect(() => {
    const fetchChartData = () => {
      dataApi
        .get("/api/students/passedFailedCount")
        .then((res) => {
          setChartData({
            passedCount: res.data.passedCount,
            failedCount: res.data.failedCount,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    };

    fetchChartData();
  }, []);

  const data = [
    ["Status", "Number of Students"],
    ["Passed", chartData.passedCount],
    ["Failed", chartData.failedCount],
  ];

  return (
    <>
      <PageTitle text="Grades Chart" />
      <Chart chartType="PieChart" data={data} width={"100%"} height={"400px"} />
    </>
  );
}

export default GradesChartPage;
