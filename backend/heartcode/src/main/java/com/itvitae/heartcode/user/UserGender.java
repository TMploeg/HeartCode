package com.itvitae.heartcode.user;

import java.util.Arrays;
import java.util.Optional;
import lombok.Getter;

@Getter
public enum UserGender {
  MALE("male"),
  FEMALE("female"),
  NON_BINARY("non-binary"),
  BINARY("binary"),
  OTHER("other"),
  PREFER_NOT_TO_SAY("prefer_not_to_say");

  private final String name;

  UserGender(String name) {
    this.name = name;
  }

  public static Optional<UserGender> parse(String value) {
    return Arrays.stream(UserGender.values())
        .filter(g -> g.getName().equalsIgnoreCase(value))
        .findFirst();
  }
}
