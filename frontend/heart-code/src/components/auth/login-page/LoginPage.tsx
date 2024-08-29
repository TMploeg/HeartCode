import { Button, Form, InputGroup } from "react-bootstrap";
import "../Auth.css";
import { useEffect, useState } from "react";
import { useAuthentication } from "../../../hooks";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import LoginData from "../../../models/LoginData";

interface LoginFieldData {
  email: LoginFieldState;
  password: LoginFieldState;
}

interface LoginFieldState {
  invalid: boolean;
  error?: string;
  touched: boolean;
}

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [loginFieldState, setLoginFieldState] = useState<LoginFieldData>({
    email: {
      invalid: false,
      touched: false,
    },
    password: {
      invalid: false,
      touched: false,
    },
  });

  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [loginFailed, setLoginFailed] = useState<boolean>(false);

  const { login } = useAuthentication();

  useEffect(() => {
    const emailInvalid = loginData.email.length === 0;
    const passwordInvalid = loginData.password.length === 0;

    setLoginFieldState((data) => ({
      ...data,
      email: {
        ...data.email,
        invalid: emailInvalid,
        error: emailInvalid ? "Email is required" : undefined,
      },
      password: {
        ...data.password,
        invalid: passwordInvalid,
        error: passwordInvalid ? "Password is required" : undefined,
      },
    }));
  }, [loginData]);

  useEffect(() => {
    setLoginFieldState((data) => ({
      ...data,
      email: {
        ...data.email,
        touched: false,
      },
      password: {
        ...data.password,
        touched: false,
      },
    }));
  }, [loginFailed]);

  return (
    <div className="auth-form">
      <InputGroup>
        <Form.Control
          placeholder="Email Address"
          style={{ marginBottom: "8px" }}
          value={loginData.email}
          onChange={(event) =>
            setLoginData((data) => ({
              ...data,
              email: event.target.value,
            }))
          }
          isInvalid={
            (loginFieldState.email.touched && loginFieldState.email.invalid) ||
            (!loginFieldState.email.touched && loginFailed)
          }
          onBlur={() =>
            setLoginFieldState((data) => ({
              ...data,
              email: { ...data.email, touched: true },
            }))
          }
          onKeyUp={handleInputKeyUp}
        />
        <Form.Control.Feedback type="invalid">
          {loginFieldState.email.error}
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Password"
          type={passwordVisible ? "text" : "password"}
          value={loginData.password}
          onChange={(event) =>
            setLoginData((data) => ({
              ...data,
              password: event.target.value,
            }))
          }
          isInvalid={
            (loginFieldState.password.touched &&
              loginFieldState.password.invalid) ||
            (!loginFieldState.password.touched && loginFailed)
          }
          onBlur={() =>
            setLoginFieldState((data) => ({
              ...data,
              password: { ...data.password, touched: true },
            }))
          }
          onKeyUp={handleInputKeyUp}
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
        <Form.Control.Feedback type="invalid">
          {loginFieldState.password.error}
        </Form.Control.Feedback>
      </InputGroup>
      <Button
        className="submit-button"
        disabled={!canSubmit()}
        onClick={submit}
      >
        Login
      </Button>
      <Link style={{ color: "#c4256a" }} to="/register">
        Register
      </Link>
      {loginFailed && (
        <div className="error">
          Login failed, username or password is incorrect
        </div>
      )}
    </div>
  );

  function canSubmit(): boolean {
    return !loginFieldState.email.invalid && !loginFieldState.password.invalid;
  }

  function submit() {
    setLoginFailed(false);
    login(loginData)
      .then(onLogin)
      .catch(() => setLoginFailed(true));
  }

  function handleInputKeyUp(event: React.KeyboardEvent) {
    if (canSubmit() && event.key === "Enter") {
      submit();
    }
  }
}
