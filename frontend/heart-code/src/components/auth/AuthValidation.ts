import moment from "moment";
import AgePreference from "../../models/AgePreference";

const MINIMUM_ACCEPTABLE_AGE = 18;

export interface RegisterInputFieldData {
  email: InputFieldData<string>;
  alias: InputFieldData<string>;
  password: InputFieldData<string>;
  passwordConfirmation: InputFieldData<string>;
  dateOfBirth: InputFieldData<string>;
  gender: InputFieldData<string>;
  relationshipType: InputFieldData<string>;
  bio: InputFieldData<string>;
  genderPreference: InputFieldData<string>;
  profilePicture: InputFieldData<Uint8Array | undefined>;
  agePreference: InputFieldData<AgePreference>;
}

export interface RegisterValidityState {
  email: ValidityState<string, string>;
  alias: ValidityState<string, string>;
  password: ValidityState<string, string>;
  passwordConfirmation: ValidityState<string, string>;
  dateOfBirth: ValidityState<string, string>;
  gender: ValidityState<string, string>;
  relationshipType: ValidityState<string, string>;
  bio: ValidityState<string, string>;
  genderPreference: ValidityState<string, string>;
  profilePicture: ValidityState<Uint8Array | undefined, string>;
  agePreference: ValidityState<AgePreference, AgePreferenceErrors>;
}

interface InputFieldData<TValue> {
  value: TValue;
  set: (value: TValue) => void;
}

interface ValidityState<TValue, TError> {
  error?: TError;
  validate?: ValidatorFunc<TValue, TError>;
  touched: boolean;
}

export interface AgePreferenceErrors {
  minAgeError?: string;
  maxAgeError?: string;
}

type ValidatorFunc<TValue, TError> = (value: TValue) => TError | undefined;

function isValidEmail(email: string): string | undefined {
  if (!email || email.length === 0) {
    return "Email is required";
  }
  if (!new RegExp("^\\S+@\\S+\\.\\S+$").test(email)) {
    return "Email is invalid";
  }

  return undefined;
}

function isValidAlias(alias: string): string | undefined {
  if (!alias || alias.length === 0) {
    return "An alias is required";
  }

  return undefined;
}

function isValidPassword(password: string): string | undefined {
  if (password == null || password.length < 7 || !passwordIsStrong(password)) {
    return `password must contain
          an uppercase letter,
          a lowercase letter,
          a number,
          a special character
          and must have at least 7 characters
        `;
  }

  return undefined;
}

function passwordIsStrong(password: string) {
  let numOfUppercase = 0;
  let numOfLowercase = 0;
  let numOfDigits = 0;
  let numOfSpecialChars = 0;
  for (let i = 0; i < password.length; i++) {
    let ch = password.charAt(i);
    let format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(ch)) {
      numOfSpecialChars++;
    } else if (/^\d+$/.test(ch)) {
      numOfDigits++;
    } else if (ch === ch.toUpperCase()) {
      numOfUppercase++;
    } else if (ch === ch.toLowerCase()) {
      numOfLowercase++;
    }
  }

  return (
    numOfUppercase >= 1 &&
    numOfLowercase >= 1 &&
    numOfDigits >= 1 &&
    numOfSpecialChars >= 1 &&
    password.length >= 7
  );
}

function isValidDateOfBirth(date: string): string | undefined {
  if (date.length === 0) {
    return "A date of birth is required";
  }
  if (
    !new RegExp(
      "^(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}$"
    ).test(date)
  ) {
    return "You must enter a valid date of birth";
  }

  const dataInfo = date.split("/");
  const dateString = dataInfo.join("-");
  const [day, month, year] = dateString.split("-");
  if (!isValidAge(new Date(+year, +month - 1, +day))) {
    return "You must be at least 18 years old";
  }

  if (
    !new RegExp(
      "^(0?[1-9]|[12][0-9]|3[01])[\\/\\-](0?[1-9]|1[012])[\\/\\-]\\d{4}$"
    ).test(date)
  ) {
    return "You must enter a valid date of birth";
  }

  return undefined;
}

function isValidAge(date: Date): boolean {
  return moment(date).isBefore(subtractYears(new Date(), 18));
}

function subtractYears(date: Date, years: number) {
  date.setFullYear(date.getFullYear() - years);
  return date;
}

function isValidAgePreference(
  agePreference: AgePreference
): AgePreferenceErrors | undefined {
  if (!agePreference.minAge) {
    return undefined;
  }

  if (agePreference.minAge < MINIMUM_ACCEPTABLE_AGE) {
    return { minAgeError: "Minimum age must be over 18" };
  }

  if (!agePreference.maxAge) {
    return undefined;
  }

  if (agePreference.maxAge < agePreference.minAge) {
    return {
      maxAgeError: "Maximum age must be greater than or equal to min age",
    };
  }

  return undefined;
}

function isValidProfilePicture(profilePicture: Uint8Array | undefined) {
  if (profilePicture === undefined) {
    return "profilePicture is required";
  }

  return undefined;
}

export {
  isValidEmail,
  isValidAlias,
  isValidPassword,
  isValidDateOfBirth,
  isValidAgePreference,
  isValidProfilePicture,
};
