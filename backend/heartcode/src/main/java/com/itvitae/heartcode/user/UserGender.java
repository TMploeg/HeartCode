package com.itvitae.heartcode.user;

import java.util.Arrays;
import java.util.Optional;

public enum UserGender {
  MALE("M"),
  FEMALE("F"),
  NON_BINARY("NB"),
  BINARY("B"),
  OTHER("O");

  private final String abbreviation;

  private UserGender(String abbreviation) {
    this.abbreviation = abbreviation;
  }

  public String abbreviation() {
    return abbreviation;
  }

  public static Optional<UserGender> getFromAbbreviation(String abbreviation) {
    return Arrays.stream(UserGender.values())
        .filter(g -> g.abbreviation().equalsIgnoreCase(abbreviation))
        .findFirst();
  }
}
