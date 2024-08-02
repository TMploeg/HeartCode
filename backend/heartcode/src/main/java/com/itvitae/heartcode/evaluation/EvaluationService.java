package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EvaluationService {
  private final EvaluationRepository evaluationRepository;

  public Evaluation createEvaluation(User evaluator, User evaluatee, boolean isLiked) {
    if (evaluationRepository
        .findByEvaluationIdEvaluatorAndEvaluationIdEvaluatee(evaluator, evaluatee)
        .isPresent()) {
      return null;
    }
    return evaluationRepository.save(new Evaluation(evaluator, evaluatee, isLiked));
  }
}
