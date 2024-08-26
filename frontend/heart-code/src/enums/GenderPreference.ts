enum GenderPreference {
  MALE = "Men",
  FEMALE = "Women",
  NON_BINARY = "Non-binary",
  BINARY = "Binary",
  ANYONE = "Anyone",
}

export default GenderPreference;

export const genderPreferences: string[] = [
  GenderPreference.MALE,
  GenderPreference.FEMALE,
  GenderPreference.NON_BINARY,
  GenderPreference.BINARY,
  GenderPreference.ANYONE,
];
