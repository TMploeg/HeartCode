import { useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import RegisterData from "../../../models/RegisterData";
import { isValidEmail, isValidPassword } from "../AuthValidation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Gender, { genders } from "../../../enums/Gender";

export default function RegisterPage() {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
    password: "",
    passwordConfirmation: "",
    gender: Gender.MALE,
  });
  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [passwordConfirmationVisible, setpasswordConfirmationVisible] =
    useState<Boolean>(false);

  const { register } = useAuthentication();
  const navigate = useNavigate();

  const formErrors: String[] = getFormErrors();

  return (
    <div className="auth-form">
      <InputGroup>
        <Form.Control
          className="input-field"
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
        <Button
          className="visibility-button"
          onClick={() => setPasswordVisible((visible) => !visible)}
        >
          <div className="icon-button-content">
            {passwordVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>
        </Button>
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Confirm Password"
          value={registerData.passwordConfirmation}
          type={passwordConfirmationVisible ? "text" : "password"}
          onChange={(event) =>
            setRegisterData((data) => ({
              ...data,
              passwordConfirmation: event.target.value,
            }))
          }
        />
        <Button
          className="visibility-button"
          onClick={() => setpasswordConfirmationVisible((visible) => !visible)}
        >
          <div className="icon-button-content">
            {passwordConfirmationVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
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
      <Button
        className="register-button"
        disabled={formErrors.length > 0}
        onClick={submit}
      >
        Register
      </Button>
      <div className="auth-form-errors">
        {formErrors.map((err, index) => (
          <div className="error-message" key={index}>
            {err}
          </div>
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

    if (registerData.password !== registerData.passwordConfirmation) {
      errors.push("password does not match");
    }

    if (!isValidPassword(registerData.password)) {
      errors.push(`password must contain:
          1 uppercase letter,
          1 lowercase letter,
          1 number,
          1 special character
        `);
      // errors.push("  - at least 1 uppercase letter");
      // errors.push("  - at least 1 lowercase letter");
      // errors.push("  - at least 1 number");
      // errors.push("  - at least 1 special character");
    }

    return errors;
  }
  function submit() {
    register(registerData)
      .then(() => navigate("/"))
      .catch(() => alert("registration failed"));
  }
}
