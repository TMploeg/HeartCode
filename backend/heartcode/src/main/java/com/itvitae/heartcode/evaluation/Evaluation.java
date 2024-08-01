package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class Evaluation {

  @OneToMany private User evaluator;

  @OneToMany private User evaluatee;

  private boolean liked;

  public Evaluation(User evaluator, User evaluatee, boolean liked) {
    this.evaluator = evaluator;
    this.evaluatee = evaluatee;
    this.liked = liked;
  }
}
