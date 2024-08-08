package com.itvitae.heartcode.user;

public enum UserRole {
  USER("ROLE_USER");

  private final String value;

  private UserRole(String value) {
    this.value = value;
  }

  public String value() {
    return value;
  }
}
