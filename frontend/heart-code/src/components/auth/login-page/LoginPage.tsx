import { Button, Form, InputGroup } from "react-bootstrap";
import "../Auth.css";
import { useState } from "react";
import { useAuthentication } from "../../../hooks";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);

  const navigate = useNavigate();
  const { login } = useAuthentication();

  const formErrors = getFormErrors();

  return (
    <div className="auth-form">
      <InputGroup>
        <Form.Control
          placeholder="Email Address"
          style={{ marginBottom: "8px" }}
          value={loginData.email}
          onChange={(event) =>
            setLoginData((data) => ({ ...data, email: event.target.value }))
          }
        />
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Password"
          type={passwordVisible ? "text" : "password"}
          value={loginData.password}
          onChange={(event) =>
            setLoginData((data) => ({ ...data, password: event.target.value }))
          }
        />
        <Button
          variant="outline-secondary"
          className="visibility-button"
          onClick={() => setPasswordVisible((visible) => !visible)}
        >
          <div className="icon-button-content">
            {passwordVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>
        </Button>
      </InputGroup>
      <Button
        className="submit-button"
        disabled={formErrors.length > 0}
        onClick={submit}
      >
        Login
      </Button>
      <div className="auth-form-errors">
        {formErrors.map((err, index) => (
          <div key={index}>{err}</div>
        ))}
      </div>
      <Link style={{ color: "#c4256a" }} to="/register">
        Register
      </Link>
    </div>
  );

  function getFormErrors(): String[] {
    const errors: String[] = [];

    if (loginData.email.length === 0) {
      errors.push("email is required");
    }

    if (loginData.password.length === 0) {
      errors.push("password is required");
    }

    return errors;
  }

  function submit() {
    login(loginData)
      .then(onLogin)
      .catch((error) => showError(error.response.data.detail));
  }

  function showError(errorMessage: string): void {
    alert(errorMessage);
    console.log(errorMessage);
  }
}
