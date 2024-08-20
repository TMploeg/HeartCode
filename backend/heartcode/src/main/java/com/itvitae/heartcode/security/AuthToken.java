package com.itvitae.heartcode.security;

import java.util.Date;

public record AuthToken(String email, String role, Date issuedAt, Date expiresAt) {
  public boolean isExpired() {
    return expiresAt.before(new Date());
  }
}
