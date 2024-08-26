package com.itvitae.heartcode.user;

import java.util.UUID;

public record UserDTO(
    String email,
    String alias,
    String gender,
    int age,
    String bio,
    UUID profilePictureId,
    String genderPreference,
    String relationshipType,
    AgePreferenceDTO agePreference) {
  public static UserDTO from(User user) {
    return new UserDTO(
        user.getEmail(),
        user.getAlias(),
        user.getGender().getName(),
        user.getAge(),
        user.getBio(),
        user.getProfilePicture().getId(),
        user.getGenderPreference().getName(),
        user.getRelationshipType().getName(),
        AgePreferenceDTO.from(user.getAgePreference().orElseGet(AgePreference::new)));
  }
}
