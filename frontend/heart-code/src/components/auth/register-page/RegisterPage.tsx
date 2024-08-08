import { useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import RegisterData from "../../../models/RegisterData";

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
    password: "",
  });

  const { register } = useAuthentication();
  const navigate = useNavigate();

  return (
    <div className="auth-form">
      <InputGroup>
        <Form.Control
          placeholder="Email Address"
          value={registerData.email}
          onChange={(event) =>
            setRegisterData((data) => ({ ...data, email: event.target.value }))
          }
        />
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Alias"
          value={registerData.alias}
          onChange={(event) =>
            setRegisterData((data) => ({ ...data, alias: event.target.value }))
          }
        />
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Password"
          value={registerData.password}
          onChange={(event) =>
            setRegisterData((data) => ({
              ...data,
              password: event.target.value,
            }))
          }
        />
      </InputGroup>
      <Button disabled={!canRegister()} onClick={submit}>
        Register
      </Button>
    </div>
  );

  function canRegister(): boolean {
    return (
      registerData.email.length > 0 &&
      registerData.alias.length > 0 &&
      registerData.password.length > 0
    );
  }

  function submit() {
    register(registerData).then(() => navigate("/"));
  }
}
