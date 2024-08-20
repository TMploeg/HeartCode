enum GenderPreference {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non-binary",
  BINARY = "binary",
  ANYONE = "anyone",
}

export default GenderPreference;

export const genderPreferences: string[] = [
  GenderPreference.MALE,
  GenderPreference.FEMALE,
  GenderPreference.NON_BINARY,
  GenderPreference.BINARY,
  GenderPreference.ANYONE,
];
