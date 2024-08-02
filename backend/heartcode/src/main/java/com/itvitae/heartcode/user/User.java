package com.itvitae.heartcode.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "users")
@NoArgsConstructor
@Getter
public class User {
  public static final String TEST_USER_NAME =
          "testuser"; // temporary, remove after implementing login

  @Id private String email;

  private String alias;

  public User(String email, String alias) {
    this.email = email;
    this.alias = alias;
  }
}
