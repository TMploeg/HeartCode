enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  NON_BINARY = "Non-binary",
  BINARY = "Binary",
  OTHER = "Other",
  PREFER_NOT_TO_SAY = "I prefer not to say",
}

export default Gender;

export const genders: string[] = [
  Gender.MALE,
  Gender.FEMALE,
  Gender.NON_BINARY,
  Gender.BINARY,
  Gender.OTHER,
  Gender.PREFER_NOT_TO_SAY,
];
