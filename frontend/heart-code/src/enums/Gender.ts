enum Gender {
  MALE = "male",
  FEMALE = "female",
  NON_BINARY = "non-binary",
  BINARY = "binary",
  OTHER = "other",
  PREFER_NOT_TO_SAY = "prefer_not_to_say",
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
