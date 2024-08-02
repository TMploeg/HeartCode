package com.itvitae.heartcode.user;

public record UserDTO(String email, String alias) {
  public static UserDTO from(User user) {
    return new UserDTO(user.getEmail(), user.getAlias());
  }
}
