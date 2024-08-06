package com.itvitae.heartcode.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

@Entity(name = "users")
@NoArgsConstructor
@Getter
public class User implements UserDetails {
  public static final String TEST_USER_NAME =
      "testuser"; // temporary, remove after implementing login

  @Id private String email;

  private String alias;

  private String password;

  private UserRole role;

  public User(String email, String alias, String password) {
    this.email = email;
    this.alias = alias;
    this.password = password;
    this.role = UserRole.USER;
  }

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
    return List.of(new SimpleGrantedAuthority(role.value()));
  }

  @Override
  public String getUsername() {
    return email;
  }

  @Override
  public boolean isAccountNonExpired() {
    return true;
  }

  @Override
  public boolean isAccountNonLocked() {
    return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
    return true;
  }

  @Override
  public boolean isEnabled() {
    return true;
  }
}
