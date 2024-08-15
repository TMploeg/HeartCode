import { useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import RegisterData from "../../../models/RegisterData";
import {
  isValidEmail,
  isValidDateOfBirth,
  isValidAge,
} from "../AuthValidation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
    password: "",
    dateOfBirth: "",
  });

  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);

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
          type={passwordVisible ? "text" : "password"}
          onChange={(event) =>
            setRegisterData((data) => ({
              ...data,
              password: event.target.value,
            }))
          }
        />
        <Button onClick={() => setPasswordVisible((visible) => !visible)}>
          <div className="icon-button-content">
            {passwordVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>
        </Button>
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Birthday DD/MM/YYYY"
          value={registerData.dateOfBirth}
          onChange={(event) =>
            setRegisterData((data) => ({
              ...data,
              dateOfBirth: event.target.value,
            }))
          }
        />
      </InputGroup>
      <Button disabled={formErrors.length > 0} onClick={submit}>
        Register
      </Button>
      <div className="auth-form-errors">
        {formErrors.map((err, index) => (
          <div key={index}>{err}</div>
        ))}
      </div>
    </div>
  );

  function getFormErrors(): String[] {
    const errors: String[] = [];

    if (registerData.email.length === 0) {
      errors.push("Email is required");
    } else if (!isValidEmail(registerData.email)) {
      errors.push("Email is invalid");
    }

    if (registerData.alias.length === 0) {
      errors.push("An alias is required");
    }

    if (registerData.password.length === 0) {
      errors.push("A password is required");
    }

    if (registerData.dateOfBirth.length === 0) {
      errors.push("A date of birth is required");
    } else if (!isValidDateOfBirth(registerData.dateOfBirth)) {
      errors.push("You must enter a valid date of birth");
    } else {
      const dataInfo = registerData.dateOfBirth.split("/");
      const dateString = dataInfo.join("-");
      const [day, month, year] = dateString.split("-");
      if (!isValidAge(new Date(+year, +month - 1, +day))) {
        console.log(new Date(+year, +month - 1, +day));
        errors.push("You must be at least 18 years old");
      }
    }

    return errors;
  }

  function submit() {
    register(registerData).then(() => navigate("/"));
  }
}
