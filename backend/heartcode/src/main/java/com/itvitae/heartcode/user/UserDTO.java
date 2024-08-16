package com.itvitae.heartcode.user;

public record UserDTO(String email, String alias, int age) {
  public static UserDTO from(User user) {
    return new UserDTO(user.getEmail(), user.getAlias(), user.getAge());
  }
}
