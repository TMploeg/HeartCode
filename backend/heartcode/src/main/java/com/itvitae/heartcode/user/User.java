package com.itvitae.heartcode.user;

import java.time.LocalDate;
import java.time.Period;
import jakarta.persistence.*;
import java.util.Collection;
import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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

  @Setter private String alias;

  @Setter
  @Lob
  private String bio;

  private String password;

  private UserRole role;

  private LocalDate dateOfBirth;

  @Setter
  @Enumerated(EnumType.ORDINAL)
  private UserGender gender;

  @Setter
  @Enumerated(EnumType.ORDINAL)
  private GenderPreference genderPreference;

  public User(
      String email, String alias, String password, UserGender gender, LocalDate dateOfBirth, String bio, GenderPreference genderPreference) {
    this.email = email;
    this.alias = alias;
    this.password = password;
    this.role = UserRole.USER;
    this.gender = gender;
    this.dateOfBirth = dateOfBirth;
    this.bio = bio;
    this.genderPreference = genderPreference;
  }

  public int getAge() {
    LocalDate now = LocalDate.now();
    Period period = Period.between(dateOfBirth, now);
    return period.getYears();
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
