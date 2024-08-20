import { useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { Link } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import RegisterData from "../../../models/RegisterData";
import {
  isValidEmail,
  isValidDateOfBirth,
  isValidAge,
  isValidPassword,
} from "../AuthValidation";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
import Gender, { genders } from "../../../enums/Gender";
import GenderPreference, {
  genderPreferences,
} from "../../../enums/GenderPreference";

interface Props {
  onRegister: () => void;
}
export default function RegisterPage({ onRegister }: Props) {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
    password: "",
    passwordConfirmation: "",
    gender: Gender.MALE,
    dateOfBirth: "",
    bio: "",
    genderPreference: GenderPreference.ANYONE,
  });

  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [passwordConfirmationVisible, setpasswordConfirmationVisible] =
    useState<Boolean>(false);

  const { register } = useAuthentication();

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
        <InputGroup>
          <Form.Control
            as="textarea"
            rows={5}
            className="bio-field"
            placeholder="Bio"
            value={registerData.bio}
            onChange={(event) =>
              setRegisterData((data) => ({
                ...data,
                bio: event.target.value,
              }))
            }
          />
        </InputGroup>
      </InputGroup>
      <h6>Preferences</h6>
      <InputGroup>
        <Form.Select
          onChange={(event) => {
            console.log(registerData.genderPreference);
            console.log(event.target.value);
            setRegisterData((data) => ({
              ...data,
              genderPreference: event.target.value,
            }));
          }}
        >
          {genderPreferences.map((genderPreference) => (
            <option key={genderPreference}>{genderPreference}</option>
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
      <Link to="/login">or login if you already have an account</Link>
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

    if (registerData.password !== registerData.passwordConfirmation) {
      errors.push("Password does not match");
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

    if (registerData.dateOfBirth.length === 0) {
      errors.push("A date of birth is required");
    } else if (!isValidDateOfBirth(registerData.dateOfBirth)) {
      errors.push("You must enter a valid date of birth");
    } else {
      const dataInfo = registerData.dateOfBirth.split("/");
      const dateString = dataInfo.join("-");
      const [day, month, year] = dateString.split("-");
      if (!isValidAge(new Date(+year, +month - 1, +day))) {
        errors.push("You must be at least 18 years old");
      }
    }

    return errors;
  }
  function submit() {
    register(registerData)
      .then(onRegister)
      .catch(() => alert("registration failed"));
  }
}
