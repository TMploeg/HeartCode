import { ChangeEvent, useEffect, useState } from "react";
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
import AgePreference from "../../../models/AgePreference";

interface Props {
  onRegister: () => void;
}

interface AgePreferenceData {
  value: string;
  enabled: boolean;
}

interface PreferedAgeInputData {
  minAge: AgePreferenceData;
  maxAge: AgePreferenceData;
}

const MINIMUM_ACCEPTABLE_AGE = 18;

export default function RegisterPage({ onRegister }: Props) {
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    alias: "",
    password: "",
    passwordConfirmation: "",
    gender: Gender.MALE,
    dateOfBirth: "",
    bio: "",
    agePreference: {},
  });

  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);
  const [passwordConfirmationVisible, setpasswordConfirmationVisible] =
    useState<Boolean>(false);
  const [profilePictureData, setProfilePictureData] = useState<
    ImageData | undefined
  >(undefined);

  const [preferedAgeInputData, setPreferedAgeInputData] =
    useState<PreferedAgeInputData>({
      minAge: {
        value: "",
        enabled: false,
      },
      maxAge: {
        value: "",
        enabled: false,
      },
    });

  const [formErrors, setFormErrors] = useState<String[]>(getFormErrors());

  const { register } = useAuthentication();

  useEffect(() => {
    registerData.profilePicture = profilePictureData?.data;
  }, [profilePictureData]);

  useEffect(() => {
    setFormErrors(getFormErrors());
  }, [registerData, preferedAgeInputData]);
  useEffect(() => {
    setRegisterData((data) => ({
      ...data,
      agePreference: {
        minAge: parseInt(preferedAgeInputData.minAge.value),
        maxAge: parseInt(preferedAgeInputData.maxAge.value),
      },
    }));
  }, [preferedAgeInputData]);

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
      <InputGroup>
        <InputGroup.Checkbox
          checked={preferedAgeInputData.minAge.enabled}
          onChange={(e) =>
            setPreferedAgeInputData((data) => ({
              ...data,
              minAge: { ...data.minAge, enabled: e.target.checked },
            }))
          }
        />
        <Form.Control
          disabled={!preferedAgeInputData.minAge.enabled}
          placeholder="Prefered min age"
          type="number"
          value={preferedAgeInputData.minAge.value}
          onChange={(e) =>
            setPreferedAgeInputData((data) => ({
              ...data,
              minAge: { ...data.minAge, value: e.target.value },
            }))
          }
        />
      </InputGroup>
      <InputGroup>
        <InputGroup.Checkbox
          disabled={!preferedAgeInputData.minAge.enabled}
          checked={
            preferedAgeInputData.minAge.enabled &&
            preferedAgeInputData.maxAge.enabled
          }
          onChange={(e) =>
            setPreferedAgeInputData((data) => ({
              ...data,
              maxAge: { ...data.maxAge, enabled: e.target.checked },
            }))
          }
        />
        <Form.Control
          disabled={
            !preferedAgeInputData.maxAge.enabled ||
            !preferedAgeInputData.minAge.enabled
          }
          placeholder="Prefered max age"
          type="number"
          value={preferedAgeInputData.maxAge.value}
          onChange={(e) =>
            setPreferedAgeInputData((data) => ({
              ...data,
              maxAge: {
                ...data.maxAge,
                value: e.target.value,
              },
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

    if (preferedAgeInputData.minAge.value.length > 0) {
      const agePreference: AgePreference = {};
      agePreference.minAge = parseInt(preferedAgeInputData.minAge.value);
      if (isNaN(agePreference.minAge)) {
        errors.push("Min age must be a valid number");
      } else if (agePreference.minAge < MINIMUM_ACCEPTABLE_AGE) {
        errors.push("Min age must be 18+");
      }

      if (preferedAgeInputData.maxAge.value.length > 0) {
        agePreference.maxAge = parseInt(preferedAgeInputData.maxAge.value);
        if (isNaN(agePreference.maxAge)) {
          errors.push("Max age must be a valid number");
        } else if (agePreference.maxAge < agePreference.minAge) {
          errors.push("Max age must be greater than or equals to min age");
        }
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
