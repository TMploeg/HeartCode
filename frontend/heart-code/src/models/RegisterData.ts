import AgePreference from "./AgePreference";

export default interface RegisterData {
  email: string;
  alias: string;
  password: string;
  passwordConfirmation: string;
  dateOfBirth: string;
  gender: string;
  relationshipType: string;
  bio: string;
  genderPreference: string;
  profilePicture?: Uint8Array;
  agePreference?: AgePreference;
}
