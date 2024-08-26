package com.itvitae.heartcode.user;

import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;

@Getter
public enum GenderPreference {
  MALE("Men"),
  FEMALE("Women"),
  NON_BINARY("Non-binary"),
  BINARY("Binary"),
  ANYONE("Anyone");

  private final String name;

  GenderPreference(String name) {
    this.name = name;
  }

  public static Optional<GenderPreference> parse(String value) {
    return Arrays.stream(GenderPreference.values())
        .filter(g -> g.getName().equalsIgnoreCase(value))
        .findFirst();
  }
}
