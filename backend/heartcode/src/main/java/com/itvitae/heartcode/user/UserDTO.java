package com.itvitae.heartcode.user;

import com.itvitae.heartcode.user.gender.GenderDTO;

public record UserDTO(String email, String alias, GenderDTO gender) {
  public static UserDTO from(User user) {
    return new UserDTO(user.getEmail(), user.getAlias(), GenderDTO.from(user.getGender()));
  }
}
