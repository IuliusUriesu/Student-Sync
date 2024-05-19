import { useContext, useEffect, useState } from "react";
import FormSubmitButton from "./FormSubmitButton";
import { Link, useNavigate } from "react-router-dom";
import PasswordRequirements from "./PasswordRequirements";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { AxiosError } from "axios";
import { User } from "../utils/user";
import { AuthenticationContext } from "../contexts/AuthenticationContext";
import { authApi } from "../utils/api/authApi";

interface AuthenticationFormProps {
  type: "sign-in" | "register";
}

function AuthenticationForm({ type }: AuthenticationFormProps) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordRequirements, setPasswordRequirements] = useState([
    { text: "At least 8 characters", ok: false },
    { text: "At least one uppercase letter: A-Z", ok: false },
    { text: "At least one lowercase letter: a-z", ok: false },
    { text: "At least one digit: 0-9", ok: false },
    { text: "At least one special character: !, #, $, ?, etc", ok: false },
  ]);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [alert, setAlert] = useState<any>(null);

  const navigate = useNavigate();

  const { setAccessToken } = useContext(AuthenticationContext);

  const check8Characters = (): boolean => {
    return formData.password.length >= 8;
  };

  const checkUppercase = (): boolean => {
    const regex = /[A-Z]/;
    return regex.test(formData.password);
  };

  const checkLowercase = (): boolean => {
    const regex = /[a-z]/;
    return regex.test(formData.password);
  };

  const checkDigit = (): boolean => {
    const regex = /[0-9]/;
    return regex.test(formData.password);
  };

  const checkSpecialCharacter = (): boolean => {
    const regex = /[^A-Za-z0-9]/;
    return regex.test(formData.password);
  };

  const checkList = [
    check8Characters,
    checkUppercase,
    checkLowercase,
    checkDigit,
    checkSpecialCharacter,
  ];

  const checkAll = (): boolean => {
    for (const check of checkList) {
      if (!check()) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (type === "sign-in") {
      return;
    }

    const newPasswordRequirements = passwordRequirements.slice();
    checkList.forEach(
      (check, index) => (newPasswordRequirements[index].ok = check())
    );

    setPasswordRequirements(newPasswordRequirements);
  }, [formData.password]);

  useEffect(() => {
    if (formData.password === formData.confirmPassword && !passwordsMatch)
      setPasswordsMatch(true);
    else if (formData.password !== formData.confirmPassword && passwordsMatch)
      setPasswordsMatch(false);
  }, [formData.password, formData.confirmPassword]);

  const passwordsMatchIcon = passwordsMatch ? (
    <IoIosCheckmarkCircleOutline className="inline text-green-600" />
  ) : (
    <IoClose className="inline text-red-600" />
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const register = () => {
    if (!checkAll() || !passwordsMatch) {
      return;
    }

    const user: User = {
      username: formData.username,
      password: formData.password,
    };

    authApi
      .post("/api/users", user)
      .then(() => {
        // setAlert(
        //   <div className="form-submit-msg ok-msg">
        //     User registered successfully!
        //   </div>
        // );
        // resetForm();
        navigate("/sign-in");
      })
      .catch((error: AxiosError) => {
        let message: any = "An unexpected error occurred!";
        if (error.response) {
          message = error.response.data;
        }
        setAlert(<div className="form-submit-msg error-msg">{message}</div>);
      });
  };

  const signIn = () => {
    const user: User = {
      username: formData.username,
      password: formData.password,
    };

    authApi
      .post("/api/users/login", user)
      .then((res) => {
        navigate("/");
        setAccessToken(res.data.accessToken);
      })
      .catch((error: AxiosError) => {
        let message: any = "An unexpected error occurred!";
        if (error.response) {
          message = error.response.data;
        }
        setAlert(<div className="form-submit-msg error-msg">{message}</div>);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (type === "register") {
      register();
    } else {
      signIn();
    }
  };

  const changePageMessage =
    type === "sign-in" ? (
      <div className="text-sm font-semibold -mt-4 mb-6 px-1">
        Don't have an account yet?{" "}
        <Link to="/register" className="link">
          Register
        </Link>
      </div>
    ) : (
      <div className="text-sm font-semibold -mt-4 mb-6 px-1">
        Already have an account?{" "}
        <Link to="/sign-in" className="link">
          Sign in
        </Link>
      </div>
    );

  return (
    <form className="form-styling" onSubmit={(e) => handleSubmit(e)}>
      <div className="mb-8">
        <label htmlFor="usernameInput" className="form-label">
          Username
        </label>
        <input
          id="usernameInput"
          type="text"
          className="form-input"
          placeholder="john_doe"
          name="username"
          value={formData.username}
          onChange={(e) => handleInputChange(e)}
          required
        />
      </div>

      <div className="mb-8">
        <label htmlFor="passwordInput" className="form-label">
          Password
        </label>
        <input
          id="passwordInput"
          type="password"
          className="form-input"
          name="password"
          value={formData.password}
          onChange={(e) => handleInputChange(e)}
          required
        />

        {type === "register" ? (
          <PasswordRequirements requirements={passwordRequirements} />
        ) : null}
      </div>

      {type === "register" ? (
        <div className="mb-8 -mt-4">
          <label htmlFor="confirmPasswordInput" className="form-label">
            Confirm Password{" "}
            {formData.password === "" && formData.confirmPassword === ""
              ? null
              : passwordsMatchIcon}
          </label>
          <input
            id="confirmPasswordInput"
            type="password"
            className="form-input"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange(e)}
            required
          />
        </div>
      ) : null}

      <FormSubmitButton text={type === "sign-in" ? "Sign in" : "Register"} />

      {changePageMessage}

      {alert}
    </form>
  );
}

export default AuthenticationForm;
