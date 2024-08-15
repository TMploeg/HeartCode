import { useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { useNavigate } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import RegisterData from "../../../models/RegisterData";
import { isValidEmail, isValidPassword } from "../AuthValidation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Gender, { genders } from "../../../enums/Gender";
import { AppRoute } from "../../../enums/AppRoute";

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
        className="submit-button"
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

    if (registerData.password !== registerData.passwordConfirmation) {
      errors.push("password does not match");
    }

    if (!isValidPassword(registerData.password)) {
      errors.push(`password must contain
          an uppercase letter,
          a lowercase letter,
          a number,
          a special character
          and must have at least 7 characters
        `);
    }

    return errors;
  }
  function submit() {
    register(registerData)
      .then(() => navigate(AppRoute.HOME))
      .catch(() => alert("registration failed"));
  }
}
