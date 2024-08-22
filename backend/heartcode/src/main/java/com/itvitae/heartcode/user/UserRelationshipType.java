package com.itvitae.heartcode.user;

import java.util.Arrays;
import java.util.Optional;
import lombok.Getter;

@Getter
public enum UserRelationshipType {
  CASUAL("Something casual"),
  SERIOUS_COMMITMENT("Something serious"),
  OPEN_TO_ANYTHING("I'm open to anything");

  private final String name;

  UserRelationshipType(String name) {
    this.name = name;
  }

  public static Optional<UserRelationshipType> parse(String value) {
    return Arrays.stream(UserRelationshipType.values())
        .filter(g -> g.getName().equalsIgnoreCase(value))
        .findFirst();
  }
}
