package com.itvitae.heartcode.user;

import java.util.Arrays;
import java.util.Optional;
import lombok.Getter;

@Getter
public enum UserGender {
  MALE("M"),
  FEMALE("F"),
  NON_BINARY("NB"),
  BINARY("B"),
  OTHER("O");

  private final String name;
  private final String abbreviation;

  private UserGender(String abbreviation) {
    this.name = this.toString().toLowerCase().replace('_', '-');
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
