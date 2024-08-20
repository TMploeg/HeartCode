import AgePreference from "./AgePreference";

export interface User {
  email: string;
  alias: string;
  gender: string;
  age: number;
  bio: string;
  profilePictureId: string;
  genderPreference: string;
  agePreference: AgePreference;
}
