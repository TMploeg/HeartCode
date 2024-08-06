package com.itvitae.heartcode.security;

import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.*;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class JwtService {
  private final SecretKey jwtSecretKey;

  @Value("${app.authentication.jwt-expiration-hrs}")
  private int JWT_EXPIRATION_HRS;

  private final UserService userService;

  private static final String ROLES_CLAIM_NAME = "roles";

  public Optional<String> generateTokenForUser(User user) {
    return Optional.ofNullable(user).map(this::buildToken);
  }

  public Optional<String> generateTokenForUser(String email) {
    return userService.findById(email).flatMap(this::generateTokenForUser);
  }

  public Optional<AuthToken> readToken(String token) {
    try {
      Claims claims =
          Jwts.parser().verifyWith(jwtSecretKey).build().parseSignedClaims(token).getPayload();

      return Optional.of(
          new AuthToken(
              claims.getSubject(),
              getRoleFromClaims(claims),
              claims.getIssuedAt(),
              claims.getExpiration()));
    } catch (RuntimeException ex) {
      return Optional.empty();
    }
  }

  private String buildToken(User user) {
    long currentTimeMillis = System.currentTimeMillis();

    return Jwts.builder()
        .claims(Map.of(ROLES_CLAIM_NAME, user.getAuthorities()))
        .subject(user.getUsername())
        .issuedAt(new Date(currentTimeMillis))
        .expiration(new Date(currentTimeMillis + getExpirationMilliseconds()))
        .signWith(jwtSecretKey)
        .compact();
  }

  private String getRoleFromClaims(Claims claims) {
    Object roleObject = claims.get(ROLES_CLAIM_NAME);

    if (roleObject == null) {
      throw new IllegalArgumentException("'" + ROLES_CLAIM_NAME + "' claim not found");
    }

    if (!(roleObject instanceof String role)) {
      throw new IllegalArgumentException("claims '" + ROLES_CLAIM_NAME + "' value is invalid");
    }

    return role;
  }

  private long getExpirationMilliseconds() {
    return JWT_EXPIRATION_HRS * 3600000L;
  }
}
