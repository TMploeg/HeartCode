import { Button, Form, InputGroup } from "react-bootstrap";
import "../Auth.css";
import { useState } from "react";
import { useApi, useToken } from "../../../hooks";
import LoginResponse from "../../../models/LoginResponse";
import { useNavigate } from "react-router-dom";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const { post } = useApi();
  const { setToken } = useToken();
  const navigate = useNavigate();

  return (
    <div className="auth-form">
      <InputGroup>
        <Form.Control
          placeholder="Email Address"
          value={loginData.email}
          onChange={(event) =>
            setLoginData((data) => ({ ...data, email: event.target.value }))
          }
        />
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Password"
          value={loginData.password}
          onChange={(event) =>
            setLoginData((data) => ({ ...data, password: event.target.value }))
          }
        />
      </InputGroup>
      <Button disabled={!canLogin()} onClick={login}>
        Login
      </Button>
    </div>
  );

  function canLogin(): boolean {
    return loginData.email.length > 0 && loginData.password.length > 0;
  }

  function login() {
    post<LoginResponse, LoginData>("users/login", loginData)
      .then((response) => handleLoginSucces(response.data))
      .catch((error) => showError(error.response.data.detail));
  }

  function handleLoginSucces(response: LoginResponse) {
    setToken(response.token);
    navigate("/");
  }

  function showError(errorMessage: string): void {
    alert(errorMessage);
    console.log(errorMessage);
  }
}
