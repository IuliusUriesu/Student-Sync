import AuthenticationForm from "../components/AuthenticationForm";
import PageTitle from "../components/PageTitle";

function SignInPage() {
  return (
    <>
      <PageTitle text="Sign in" />
      <AuthenticationForm type="sign-in" />
    </>
  );
}

export default SignInPage;
