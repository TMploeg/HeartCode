package com.itvitae.heartcode.security;

import io.jsonwebtoken.Jwts;
import javax.crypto.SecretKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
  @Bean
  public PasswordEncoder passwordEncoder() {
    return PasswordEncoderFactories.createDelegatingPasswordEncoder();
  }

  @Bean
  public SecurityFilterChain securityFilterChain(
      HttpSecurity httpSecurity, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
    return httpSecurity
        .csrf(AbstractHttpConfigurer::disable)
        .authorizeHttpRequests(
            requests ->
                requests
                    .requestMatchers("api/v1/users/**")
                    .permitAll()
                    .anyRequest()
                    .authenticated())
        .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
        .exceptionHandling(
            exceptionHandlingConfigurer ->
                exceptionHandlingConfigurer.authenticationEntryPoint(new UnauthorizedEntryPoint()))
        .build();
  }

  @Bean
  public SecretKey secretKey() {
    return Jwts.SIG.HS256.key().build();
  }
}
