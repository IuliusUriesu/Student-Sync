import { useNavigate } from "react-router-dom";

function GoBackButton() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <button className="go-back-btn" onClick={goBack}>
      {"< Go Back"}
    </button>
  );
}

export default GoBackButton;
