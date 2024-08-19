package com.itvitae.heartcode.user;

import java.util.UUID;

public record UserDTO(String email, String alias, String gender, UUID profilePictureId) {
  public static UserDTO from(User user) {
    return new UserDTO(
        user.getEmail(),
        user.getAlias(),
        user.getGender().getName(),
        user.getProfilePicture().getId());
  }
}
