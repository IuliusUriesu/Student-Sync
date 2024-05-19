import { useContext } from "react";
import { StudentsPageContext } from "../contexts/StudentsPageContext";

interface PageNavigationProps {
  pageCount: number;
}

function PageNavigation({ pageCount }: PageNavigationProps) {
  const { pageProperties, setCurrentPage } = useContext(StudentsPageContext);

  return (
    <nav>
      <div className="container flex flex-row justify-center my-8">
        <button
          className="page-nav-btn bg-sky-500 rounded-s-full"
          onClick={() => setCurrentPage(1)}
        >
          1
        </button>

        <button
          className="page-nav-btn bg-sky-500"
          onClick={() => {
            if (pageProperties.currentPage > 1)
              setCurrentPage(pageProperties.currentPage - 1);
          }}
        >
          {"< Previous"}
        </button>

        <button className="page-nav-btn bg-blue-900 font-bold">
          {pageProperties.currentPage}
        </button>

        <button
          className="page-nav-btn bg-sky-500"
          onClick={() => {
            if (pageProperties.currentPage < pageCount)
              setCurrentPage(pageProperties.currentPage + 1);
          }}
        >
          {"Next >"}
        </button>

        <button
          className="page-nav-btn bg-sky-500 rounded-e-full"
          onClick={() => setCurrentPage(pageCount)}
        >
          {pageCount}
        </button>
      </div>
    </nav>
  );
}

export default PageNavigation;
