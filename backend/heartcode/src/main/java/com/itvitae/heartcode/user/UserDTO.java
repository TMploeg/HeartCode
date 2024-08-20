package com.itvitae.heartcode.user;

import java.util.UUID;

public record UserDTO(
    String email,
    String alias,
    String gender,
    int age,
    String bio,
    UUID profilePictureId,
    AgePreferenceDTO agePreference) {
  public static UserDTO from(User user) {
    return new UserDTO(
        user.getEmail(),
        user.getAlias(),
        user.getGender().getName(),
        user.getAge(),
        user.getBio(),
        user.getProfilePicture().getId(),
        AgePreferenceDTO.from(user.getAgePreference().orElseGet(AgePreference::new)));
  }
}
