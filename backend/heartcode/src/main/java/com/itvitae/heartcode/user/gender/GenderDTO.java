package com.itvitae.heartcode.user.gender;

public record GenderDTO(String name, String abbreviation) {
  public static GenderDTO from(UserGender gender) {
    return new GenderDTO(gender.getName(), gender.getAbbreviation());
  }
}
