package com.itvitae.heartcode.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class UnauthorizedEntryPoint implements AuthenticationEntryPoint {
  @Override
  public void commence(
      HttpServletRequest request,
      HttpServletResponse response,
      AuthenticationException authException)
      throws IOException, ServletException {
    if (SecurityContextHolder.getContext().getAuthentication().isAuthenticated()) {
      System.out.println(this.getClass().getSimpleName() + ": authenticated");
    } else {
      System.out.println(this.getClass().getSimpleName() + ": not authenticated");
    }
  }
}
