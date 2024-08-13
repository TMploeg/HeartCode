package com.itvitae.heartcode.user.gender;

import java.util.Arrays;
import java.util.Optional;
import lombok.Getter;

@Getter
public enum UserGender {
  MALE("male", "M"),
  FEMALE("female", "F"),
  NON_BINARY("non-binary", "NB"),
  BINARY("binary", "B"),
  OTHER("other", "O"),
  PREFER_NOT_TO_SAY("prefer_not_to_say", "-");

  private final String name;
  private final String abbreviation;

  private UserGender(String name, String abbreviation) {
    this.name = name;
    this.abbreviation = abbreviation;
  }

  public static Optional<UserGender> parse(String value) {
    return Arrays.stream(UserGender.values())
        .filter(
            g -> g.getName().equalsIgnoreCase(value) || g.getAbbreviation().equalsIgnoreCase(value))
        .findFirst();
  }

  public String getDisplayString() {
    return this.getName() + "(" + this.getAbbreviation() + ")";
  }
}
