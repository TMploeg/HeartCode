package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
public class Evaluation {

  @EmbeddedId private EvaluationId evaluationId;

  @Getter private boolean liked;

  public User getEvaluator() {
    return evaluationId.getEvaluator();
  }

  public User getEvaluatee() {
    return evaluationId.getEvaluatee();
  }

  public Evaluation(User evaluator, User evaluatee, boolean liked) {
    this.evaluationId = new EvaluationId(evaluator, evaluatee);
    this.liked = liked;
  }
}
