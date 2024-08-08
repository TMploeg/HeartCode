import { useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import RegisterData from "../../../models/RegisterData";
import { isValidEmail } from "../AuthValidation";

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
    password: "",
  });

  const { register } = useAuthentication();
  const navigate = useNavigate();

  const formErrors: String[] = getFormErrors();

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
      <Button disabled={formErrors.length > 0} onClick={submit}>
        Register
      </Button>
      <div className="auth-form-errors">
        {formErrors.map((err) => (
          <div>{err}</div>
        ))}
      </div>
    </div>
  );

  function getFormErrors(): String[] {
    const errors: String[] = [];

    if (registerData.email.length === 0) {
      errors.push("email is required");
    } else if (!isValidEmail(registerData.email)) {
      errors.push("email is invalid");
    }

    if (registerData.alias.length === 0) {
      errors.push("alias is required");
    }

    if (registerData.password.length === 0) {
      errors.push("password is required");
    }

    return errors;
  }

  function submit() {
    register(registerData).then(() => navigate("/"));
  }
}
