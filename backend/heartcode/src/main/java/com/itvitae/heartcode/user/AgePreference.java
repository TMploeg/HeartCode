package com.itvitae.heartcode.user;

import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AgePreference {
  private Integer minAge;
  private Integer maxAge;

  public boolean minAgeUnder18() {
    return minAge != null && minAge < 18;
  }

  public boolean maxAgeSmallerThanMinAge() {
    return maxAge != null && minAge != null && maxAge < minAge;
  }
}
