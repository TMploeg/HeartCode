import { useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { Link, useNavigate } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import RegisterData from "../../../models/RegisterData";
import { isValidEmail } from "../AuthValidation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Gender, { genders } from "../../../enums/Gender";

interface Props {
  onRegister: () => void;
}
export default function RegisterPage({ onRegister }: Props) {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
    password: "",
    gender: Gender.MALE,
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
        <Form.Select
          onChange={(event) =>
            setRegisterData((data) => ({ ...data, gender: event.target.value }))
          }
        >
          {genders.map((gender) => (
            <option key={gender}>{gender}</option>
          ))}
        </Form.Select>
      </InputGroup>
      <Button disabled={formErrors.length > 0} onClick={submit}>
        Register
      </Button>
      <div className="auth-form-errors">
        {formErrors.map((err, index) => (
          <div key={index}>{err}</div>
        ))}
      </div>
      <Link to="/login">or login if you already have an account</Link>
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
    register(registerData)
      .then(onRegister)
      .catch(() => alert("registration failed"));
  }
}
