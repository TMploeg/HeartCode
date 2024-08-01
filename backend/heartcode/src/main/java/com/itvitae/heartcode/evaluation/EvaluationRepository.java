package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EvaluationRepository extends JpaRepository<Evaluation, User> {
    Optional <Evaluation> findByEvaluationIdEvaluatorAndEvaluationIdEvaluatee(User Evaluator, User Evaluatee);

}
