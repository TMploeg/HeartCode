package com.itvitae.heartcode.match;

import com.itvitae.heartcode.user.User;
import jakarta.persistence.*;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class Match {

  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @ManyToOne private User user1;

  @ManyToOne private User user2;

  public Match(User user1, User user2) {
    this.user1 = user1;
    this.user2 = user2;
  }
}
