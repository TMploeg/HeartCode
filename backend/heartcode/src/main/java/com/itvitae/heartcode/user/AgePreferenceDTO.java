package com.itvitae.heartcode.user;


public record AgePreferenceDTO(Integer minAge, Integer maxAge) {
  public static AgePreferenceDTO from(AgePreference agePreference) {
    return new AgePreferenceDTO(agePreference.getMinAge(), agePreference.getMaxAge());
  }

  public AgePreference convert() {
    return new AgePreference(minAge, maxAge);
  }
}
