import AgePreference from "./AgePreference";

export interface User {
  email: string;
  alias: string;
  gender: string;
  age: number;
  relationshipType: string;
  bio: string;
  profilePictureId: string;
  genderPreference: string;
  agePreference: AgePreference;
}
