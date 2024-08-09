package com.itvitae.heartcode.security;

import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import java.util.*;
import javax.crypto.SecretKey;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
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

    Map<String, Object> claims = new HashMap<>();
    claims.put(
        ROLES_CLAIM_NAME,
        user.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList());

    return Jwts.builder()
        .claims(claims)
        .subject(user.getUsername())
        .issuedAt(new Date(currentTimeMillis))
        .expiration(new Date(currentTimeMillis + getExpirationMilliseconds()))
        .signWith(jwtSecretKey)
        .compact();
  }

  private String getRoleFromClaims(Claims claims) {
    Object rolesObject = claims.get(ROLES_CLAIM_NAME);

    if (rolesObject == null) {
      throw new IllegalArgumentException("JwtService: '" + ROLES_CLAIM_NAME + "' claim not found");
    }

    if (!(rolesObject instanceof Iterable<?> roles)) {
      throw new IllegalArgumentException(
          "JwtService: claim '" + ROLES_CLAIM_NAME + "' value is invalid");
    }

    List<String> parsedRoles = new LinkedList<>();

    for (Object o : roles) {
      if (o instanceof String parsedRole) {
        parsedRoles.add(parsedRole);
      }
    }

    if (parsedRoles.isEmpty()) {
      throw new RuntimeException("JwtService: no roles found");
    }
    if (parsedRoles.size() > 1) {
      throw new RuntimeException("JwtService: multiple roles found");
    }

    return parsedRoles.get(0);
  }

  private long getExpirationMilliseconds() {
    return JWT_EXPIRATION_HRS * 3600000L;
  }
}
