package com.itvitae.heartcode.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "users")
@NoArgsConstructor
@Getter
public class User {
  @Id private String email;

  private String alias;

  public User(String email, String alias) {
    this.email = email;
    this.alias = alias;
  }
}
