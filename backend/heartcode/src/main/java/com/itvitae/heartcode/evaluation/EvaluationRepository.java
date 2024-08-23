package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation, User> {
  Optional<Evaluation> findByEvaluatorAndEvaluatee(
      //  Optional<Evaluation> findByEvaluationIdEvaluatorAndEvaluationIdEvaluatee(
      User Evaluator, User Evaluatee);
}
