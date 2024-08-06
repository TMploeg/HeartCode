package com.itvitae.heartcode.user;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

public enum UserRole {
  USER("user");

  private GrantedAuthority value;

  private UserRole(String value) {
    this.value = new SimpleGrantedAuthority(value);
  }

  public GrantedAuthority value() {
    return value;
  }
}
