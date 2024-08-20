import { useEffect, useState } from "react";
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
import ProfilePictureInput, {
  ImageData,
} from "../../general/profile-picture-input/ProfilePictureInput";
import GenderPreference, {
  genderPreferences,
} from "../../../enums/GenderPreference";
import RelationshipType, {
  relationshipTypes,
} from "../../../enums/RelationshipType";

interface Props {
  onRegister: () => void;
}
export default function RegisterPage({ onRegister }: Props) {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
    password: "",
    passwordConfirmation: "",
    dateOfBirth: "",
    gender: Gender.MALE,
    relationshipType: RelationshipType.CASUAL,
    bio: "",
    genderPreference: GenderPreference.ANYONE,
  });

  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [passwordConfirmationVisible, setpasswordConfirmationVisible] =
    useState<Boolean>(false);
  const [profilePictureData, setProfilePictureData] = useState<
    ImageData | undefined
  >(undefined);

  const { register } = useAuthentication();

  useEffect(() => {
    registerData.profilePicture = profilePictureData?.data;
  }, [profilePictureData]);

  const formErrors: String[] = getFormErrors();

  return (
    <div className="auth-form">
      <ProfilePictureInput
        value={profilePictureData}
        onChange={setProfilePictureData}
      />
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
          variant="outline-secondary"
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
          variant="outline-secondary"
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
      </InputGroup>
      <InputGroup>
        <Form.Select
          onChange={(event) =>
            setRegisterData((data) => ({
              ...data,
              relationshipType: event.target.value,
            }))
          }
        >
          {relationshipTypes.map((relationshipType) => (
            <option key={relationshipType}>{relationshipType}</option>
          ))}
        </Form.Select>
      </InputGroup>
      <h6>Preferences</h6>
      <InputGroup>
        <Form.Select
          onChange={(event) => {
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
      .catch((error) => showError(error.response.data.detail));
  }

  function showError(errorMessage: string): void {
    alert(errorMessage);
    console.log(errorMessage);
  }

  // function chooseImage(): void {
  //   const input = document.createElement("input");
  //   input.accept = "image/*";
  //   input.type = "file";
  //   input.click();
  //   input.addEventListener("change", async (event) => {
  //     const files: FileList | null = (event.target as HTMLInputElement).files;
  //     if (files === null || files.length === 0) {
  //       return;
  //     }

  //     const bytes: Uint8Array = new Uint8Array(await files[0].arrayBuffer());
  //     setRegisterData((data) => ({ ...data, profilePicture: bytes }));

  //     const reader = new FileReader();
  //     reader.addEventListener("load", async () => {
  //       if (reader.result === null || reader.result instanceof ArrayBuffer) {
  //         return;
  //       }

  //       setProfilePictureDataURL(reader.result);
  //     });
  //     reader.readAsDataURL(files[0]);
  //   });
  // }
}
