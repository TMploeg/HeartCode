import { useState } from "react";
import "../Auth.css";
import { useApi, useAuthentication } from "../../../hooks";
import { Link, useNavigate } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import RegisterData from "../../../models/RegisterData";
import { isValidEmail, isValidPassword } from "../AuthValidation";
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
    passwordConfirmation: "",
    gender: Gender.MALE,
  });
  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [passwordConfirmationVisible, setpasswordConfirmationVisible] =
    useState<Boolean>(false);
  const [profilePictureDataURL, setProfilePictureDataURL] = useState<
    string | null
  >(null);

  const { register } = useAuthentication();

  const formErrors: String[] = getFormErrors();

  return (
    <div className="auth-form">
      <div className="profile-picture-input-field" onClick={chooseImage}>
        {profilePictureDataURL != null ? (
          <img
            src={profilePictureDataURL}
            className="profile-picture-display"
          />
        ) : (
          <>
            Click here
            <br />
            to select a
            <br />
            profile picture
          </>
        )}
      </div>
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
      .then(onRegister)
      .catch(() => alert("registration failed"));
  }

  function chooseImage(): void {
    const input = document.createElement("input");
    input.accept = "image/*";
    input.type = "file";
    input.click();
    input.addEventListener("change", async (event) => {
      const files: FileList | null = (event.target as HTMLInputElement).files;
      if (files === null || files.length === 0) {
        return;
      }

      const bytes: Uint8Array = new Uint8Array(await files[0].arrayBuffer());
      setRegisterData((data) => ({ ...data, profilePicture: bytes }));

      const reader = new FileReader();
      reader.addEventListener("load", async () => {
        if (reader.result === null || reader.result instanceof ArrayBuffer) {
          return;
        }

        setProfilePictureDataURL(reader.result);
      });
      reader.readAsDataURL(files[0]);
    });
  }
}
