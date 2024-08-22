import { useEffect, useState } from "react";
import "../Auth.css";
import { useAuthentication } from "../../../hooks";
import { Link } from "react-router-dom";
import { InputGroup, Button, Form } from "react-bootstrap";
import {
  isValidEmail,
  isValidDateOfBirth,
  isValidPassword,
  RegisterInputFieldData,
  isValidAlias,
  isValidAgePreference,
  RegisterValidityState,
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
import AgePreferenceInput from "../../general/age-preference-input/AgePreferenceInput";
import RegisterData from "../../../models/RegisterData";

interface Props {
  onRegister: () => void;
}

export default function RegisterPage({ onRegister }: Props) {
  const [registerData, setRegisterData] = useState<RegisterInputFieldData>(
    getInitialRegisterData()
  );
  const [registerValidityState, setRegisterValidityState] =
    useState<RegisterValidityState>(getInitialValidityState());

  const [passwordVisible, setPasswordVisible] = useState<Boolean>(false);

  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState<Boolean>(false);

  const [profilePictureData, setProfilePictureData] = useState<
    ImageData | undefined
  >(undefined);

  const { register } = useAuthentication();

  useEffect(() => {
    if (registerData.profilePicture && profilePictureData) {
      registerData.profilePicture.set(profilePictureData.data);
    }
  }, [profilePictureData]);

  useEffect(() => {
    updateFormValidation();
    validatePasswordConfirmation();
  }, [registerData]);

  return (
    <div className="auth-form">
      <ProfilePictureInput
        value={profilePictureData}
        onChange={setProfilePictureData}
      />
      <InputGroup>
        <Form.Control
          placeholder="Email Address"
          value={registerData.email.value}
          onChange={(event) => registerData.email.set(event.target.value)}
          isInvalid={
            registerValidityState.email.touched &&
            registerValidityState.email.error !== undefined
          }
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              email: { ...data.email, touched: true },
            }))
          }
        />
        <Form.Control.Feedback type="invalid">
          {registerValidityState.email.error}
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Alias"
          value={registerData.alias.value}
          onChange={(event) => registerData.alias.set(event.target.value)}
          isInvalid={
            registerValidityState.alias.touched &&
            registerValidityState.alias.error !== undefined
          }
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              alias: { ...data.alias, touched: true },
            }))
          }
        />
        <Form.Control.Feedback type="invalid">
          {registerValidityState.alias.error}
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Password"
          value={registerData.password.value}
          type={passwordVisible ? "text" : "password"}
          onChange={(event) => registerData.password.set(event.target.value)}
          isInvalid={
            registerValidityState.password.touched &&
            registerValidityState.password.error !== undefined
          }
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              password: { ...data.password, touched: true },
            }))
          }
        />
        <Button
          tabIndex={-1}
          variant="outline-secondary"
          className="visibility-button"
          onClick={() => setPasswordVisible((visible) => !visible)}
        >
          <div className="icon-button-content">
            {passwordVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>
        </Button>
        <Form.Control.Feedback type="invalid">
          {registerValidityState.password.error}
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Confirm Password"
          value={registerData.passwordConfirmation.value}
          type={passwordConfirmationVisible ? "text" : "password"}
          onChange={(event) =>
            registerData.passwordConfirmation.set(event.target.value)
          }
          isInvalid={
            registerValidityState.passwordConfirmation.touched &&
            registerValidityState.passwordConfirmation.error !== undefined
          }
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              passwordConfirmation: {
                ...data.passwordConfirmation,
                touched: true,
              },
            }))
          }
        />
        <Button
          tabIndex={-1}
          variant="outline-secondary"
          className="visibility-button"
          onClick={() => setPasswordConfirmationVisible((visible) => !visible)}
        >
          <div className="icon-button-content">
            {passwordConfirmationVisible ? <BsEyeFill /> : <BsEyeSlashFill />}
          </div>
        </Button>
        <Form.Control.Feedback type="invalid">
          {registerValidityState.passwordConfirmation.error}
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup>
        <Form.Control
          placeholder="Birthday DD/MM/YYYY"
          value={registerData.dateOfBirth.value}
          onChange={(event) => registerData.dateOfBirth.set(event.target.value)}
          isInvalid={
            registerValidityState.dateOfBirth.touched &&
            registerValidityState.dateOfBirth.error !== undefined
          }
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              dateOfBirth: { ...data.dateOfBirth, touched: true },
            }))
          }
        />
        <Form.Control.Feedback type="invalid">
          {registerValidityState.dateOfBirth.error}
        </Form.Control.Feedback>
      </InputGroup>
      <InputGroup>
        <Form.Select
          onChange={(event) => registerData.gender.set(event.target.value)}
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              gender: { ...data.gender, touched: true },
            }))
          }
        >
          {genders.map((gender) => (
            <option key={gender}>{gender}</option>
          ))}
        </Form.Select>
      </InputGroup>
      <InputGroup>
        <Form.Control
          as="textarea"
          rows={5}
          className="bio-field"
          placeholder="Bio"
          value={registerData.bio.value}
          onChange={(event) => registerData.bio.set(event.target.value)}
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              bio: { ...data.bio, touched: true },
            }))
          }
        />
      </InputGroup>
      <h6>Preferences</h6>
      <InputGroup>
        <Form.Select
          onChange={(event) =>
            registerData.relationshipType.set(event.target.value)
          }
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              relationshipType: { ...data.relationshipType, touched: true },
            }))
          }
        >
          {relationshipTypes.map((relationshipType) => (
            <option key={relationshipType}>{relationshipType}</option>
          ))}
        </Form.Select>
      </InputGroup>
      <InputGroup>
        <Form.Select
          onChange={(event) =>
            registerData.genderPreference.set(event.target.value)
          }
          onBlur={() =>
            setRegisterValidityState((data) => ({
              ...data,
              genderPreference: { ...data.genderPreference, touched: true },
            }))
          }
        >
          {genderPreferences.map((genderPreference) => (
            <option key={genderPreference}>{genderPreference}</option>
          ))}
        </Form.Select>
      </InputGroup>
      <AgePreferenceInput
        onChange={(newValue) => registerData.agePreference.set(newValue)}
        validationState={registerValidityState.agePreference.error}
        onBlur={() =>
          setRegisterValidityState((data) => ({
            ...data,
            agePreference: { ...data.agePreference, touched: true },
          }))
        }
        touched={registerValidityState.agePreference.touched}
      />
      <Button
        className="submit-button"
        disabled={isFormInvalid()}
        onClick={submit}
      >
        Register
      </Button>
      <Link to="/login">or login if you already have an account</Link>
    </div>
  );

  function updateFormValidation(): void {
    setRegisterValidityState((data) => ({
      ...data,
      email: {
        ...data.email,
        error: data.email.validate?.(registerData.email.value),
      },
      alias: {
        ...data.alias,
        error: data.alias.validate?.(registerData.alias.value),
      },
      password: {
        ...data.password,
        error: data.password.validate?.(registerData.password.value),
      },
      passwordConfirmation: {
        ...data.passwordConfirmation,
        error: data.passwordConfirmation.validate?.(
          registerData.passwordConfirmation.value
        ),
      },
      dateOfBirth: {
        ...data.dateOfBirth,
        error: data.dateOfBirth.validate?.(registerData.dateOfBirth.value),
      },
      gender: {
        ...data.gender,
        error: data.gender.validate?.(registerData.gender.value),
      },
      relationshipType: {
        ...data.relationshipType,
        error: data.relationshipType.validate?.(
          registerData.relationshipType.value
        ),
      },
      bio: { ...data.bio, error: data.bio.validate?.(registerData.bio.value) },
      genderPreference: {
        ...data.genderPreference,
        error: data.genderPreference.validate?.(
          registerData.genderPreference.value
        ),
      },
      profilePicture: {
        ...data.profilePicture,
        error: data.profilePicture.validate?.(
          registerData.profilePicture.value
        ),
      },
      agePreference: {
        ...data.agePreference,
        error: data.agePreference.validate?.(registerData.agePreference.value),
      },
    }));
  }

  function submit() {
    const finalRegisterData: RegisterData = {
      email: registerData.email.value,
      alias: registerData.alias.value,
      password: registerData.password.value,
      passwordConfirmation: registerData.passwordConfirmation.value,
      dateOfBirth: registerData.dateOfBirth.value,
      gender: registerData.gender.value,
      relationshipType: registerData.relationshipType.value,
      bio: registerData.bio.value,
      genderPreference: registerData.genderPreference.value,
      profilePicture: registerData.profilePicture.value,
      agePreference: registerData.agePreference.value,
    };

    register(finalRegisterData)
      .then(onRegister)
      .catch((error) => showError(error.response.data.detail));
  }

  function showError(errorMessage: string): void {
    alert(errorMessage);
    errorMessage;
  }

  function isFormInvalid() {
    return (
      Object.values(registerData).find((field) => field.error !== undefined) !==
      undefined
    );
  }

  function getInitialRegisterData(): RegisterInputFieldData {
    return {
      email: {
        value: "",
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            email: { ...data.email, value: newValue },
          })),
      },
      alias: {
        value: "",
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            alias: { ...data.alias, value: newValue },
          })),
      },
      password: {
        value: "",
        set: (newValue) => {
          newValue;
          setRegisterData((data) => ({
            ...data,
            password: { ...data.password, value: newValue },
          }));
        },
      },
      passwordConfirmation: {
        value: "",
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            passwordConfirmation: {
              ...data.passwordConfirmation,
              value: newValue,
            },
          })),
      },
      dateOfBirth: {
        value: "",
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            dateOfBirth: { ...data.dateOfBirth, value: newValue },
          })),
      },
      gender: {
        value: Gender.MALE,
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            gender: { ...data.gender, value: newValue },
          })),
      },
      relationshipType: {
        value: RelationshipType.CASUAL,
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            relationshipType: { ...data.relationshipType, value: newValue },
          })),
      },
      bio: {
        value: "",
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            bio: { ...data.bio, value: newValue },
          })),
      },
      genderPreference: {
        value: GenderPreference.ANYONE,
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            genderPreference: { ...data.genderPreference, value: newValue },
          })),
      },
      profilePicture: {
        value: undefined,
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            profilePicture: { ...data.profilePicture, value: newValue },
          })),
      },
      agePreference: {
        value: {},
        set: (newValue) =>
          setRegisterData((data) => ({
            ...data,
            agePreference: { ...data.agePreference, value: newValue },
          })),
      },
    };
  }

  function getInitialValidityState(): RegisterValidityState {
    return {
      email: {
        validate: isValidEmail,
        touched: false,
      },
      alias: {
        validate: isValidAlias,
        touched: false,
      },
      password: {
        validate: isValidPassword,
        touched: false,
      },
      passwordConfirmation: {
        touched: false,
      },
      dateOfBirth: {
        validate: isValidDateOfBirth,
        touched: false,
      },
      gender: {
        touched: false,
      },
      relationshipType: {
        touched: false,
      },
      bio: {
        touched: false,
      },
      genderPreference: {
        touched: false,
      },
      profilePicture: {
        touched: false,
      },
      agePreference: {
        validate: isValidAgePreference,
        touched: false,
      },
    };
  }

  function validatePasswordConfirmation() {
    setRegisterValidityState((state) => ({
      ...state,
      passwordConfirmation: {
        ...state.passwordConfirmation,
        error:
          registerData.password.value !==
          registerData.passwordConfirmation.value
            ? "Passwords do not match"
            : undefined,
      },
    }));
  }
}
