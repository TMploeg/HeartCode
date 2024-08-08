package com.itvitae.heartcode.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;

public class UnauthorizedEntryPoint implements AuthenticationEntryPoint {
  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException, ServletException {
    Optional<Authentication> authentication =
        Optional.ofNullable(SecurityContextHolder.getContext().getAuthentication());

    if (authentication.filter(Authentication::isAuthenticated).isPresent()) {
      response.sendError(HttpStatus.FORBIDDEN.value());
    } else {
      response.sendError(HttpStatus.UNAUTHORIZED.value());
    }
  }
}
