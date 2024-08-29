package com.itvitae.heartcode.user;

import com.fasterxml.jackson.annotation.JsonValue;
import java.util.Arrays;
import java.util.Optional;

public enum UserGender {
  MALE("Male"),
  FEMALE("Female"),
  NON_BINARY("Non-binary"),
  BINARY("Binary"),
  OTHER("Other"),
  PREFER_NOT_TO_SAY("I prefer not to say");

  private final String name;

  UserGender(String name) {
    this.name = name;
  }

  public static Optional<UserGender> parse(String value) {
    return Arrays.stream(UserGender.values())
        .filter(g -> g.getName().equalsIgnoreCase(value))
        .findFirst();
  }

  @JsonValue
  public String getName() {
    return this.name;
  }
}
