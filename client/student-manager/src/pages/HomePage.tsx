import PageTitle from "../components/PageTitle";
import circleImage from "../assets/images/circle.png";

function HomePage() {
  return (
    <>
      <PageTitle text="Home" />
      <img
        src={circleImage}
        alt="Circle Image"
        className="mx-auto w-1/2 rounded-md"
      />
    </>
  );
}

export default HomePage;
