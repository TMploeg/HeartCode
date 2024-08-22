package com.itvitae.heartcode.user;

import java.util.Arrays;
import java.util.Optional;
import lombok.Getter;

@Getter
public enum GenderPreference {
  MALE("male"),
  FEMALE("female"),
  NON_BINARY("non-binary"),
  BINARY("binary"),
  OTHER("other"),
  PREFER_NOT_TO_SAY("prefer_not_to_say"),
  ANYONE("anyone");

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
