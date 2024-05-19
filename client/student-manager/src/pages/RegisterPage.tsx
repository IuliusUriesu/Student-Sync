import AuthenticationForm from "../components/AuthenticationForm";
import PageTitle from "../components/PageTitle";

function RegisterPage() {
  return (
    <>
      <PageTitle text="Register" />
      <AuthenticationForm type="register" />
    </>
  );
}

export default RegisterPage;
