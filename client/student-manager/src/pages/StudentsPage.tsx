import PageNavigation from "../components/PageNavigation";

import { useContext, useEffect, useState } from "react";
import StudentList from "../components/StudentList";
import PageTitle from "../components/PageTitle";
import Dropdown from "../components/Dropdown";
import { StudentsPageContext } from "../contexts/StudentsPageContext";
import { ServerStatusContext } from "../contexts/ServerStatusContext";
import { dataApi } from "../utils/api/dataApi";

function StudentsPage() {
  const [pageCount, setPageCount] = useState(1);

  const { pageProperties, setPageSize, setSortBy, setOrder } =
    useContext(StudentsPageContext);
  const { serverOnline } = useContext(ServerStatusContext);

  const getPageCount = () => {
    dataApi
      .get(`/api/students/pages?pageSize=${pageProperties.pageSize}`)
      .then((res) => {
        setPageCount(res.data.pageCount);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getPageCount();
  }, [pageProperties.pageSize, serverOnline]);

  const handleDelete = () => {
    getPageCount();
  };

  const handlePageSizeDropdownChange = (value: string) => {
    setPageSize(parseInt(value));
  };

  const handleSortByDropdownChange = (value: string) => {
    setSortBy(value);
  };

  const handleOrderDropdownChange = (value: string) => {
    setOrder(value);
  };

  return (
    <>
      <PageTitle text="Browse Students" />

      <div className="flex flex-row justify-center space-x-12 mb-4">
        <Dropdown
          dropdownId="pageSizeDropdown"
          label="Students on page: "
          options={["3", "6", "9", "12", "15"]}
          value={pageProperties.pageSize.toString()}
          onChange={handlePageSizeDropdownChange}
        />
        <Dropdown
          dropdownId="sortByDropdown"
          label="Sort by: "
          options={["ID", "Name", "Score"]}
          value={pageProperties.sortBy}
          onChange={handleSortByDropdownChange}
        />
        <Dropdown
          dropdownId="orderDropdown"
          label="Order: "
          options={["Ascending", "Descending"]}
          value={pageProperties.order}
          onChange={handleOrderDropdownChange}
        />
      </div>

      <StudentList onDelete={handleDelete} />

      <PageNavigation pageCount={pageCount} />
    </>
  );
}

export default StudentsPage;
