package com.itvitae.heartcode.user;

public record UserDTO(
    String email, String alias, String gender, int age, String relationshipType, String bio) {
  public static UserDTO from(User user) {
    return new UserDTO(
        user.getEmail(),
        user.getAlias(),
        user.getGender().getName(),
        user.getAge(),
        user.getRelationshipType().getName(),
        user.getBio());
  }
}
