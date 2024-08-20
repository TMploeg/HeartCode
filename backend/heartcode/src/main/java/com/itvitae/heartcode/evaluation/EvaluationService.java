package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import jakarta.transaction.Transactional;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class EvaluationService {
  private final EvaluationRepository evaluationRepository;

  public Evaluation createEvaluation(User evaluator, User evaluatee, boolean isLiked) {
    if (getEvaluation(evaluator, evaluatee).isPresent()) {
      return null;
    }

    return evaluationRepository.save(new Evaluation(evaluator, evaluatee, isLiked));
  }

  public Optional<Evaluation> getEvaluation(User evaluator, User evaluatee) {
    return evaluationRepository.findByEvaluationIdEvaluatorAndEvaluationIdEvaluatee(
        evaluator, evaluatee);
  }
}
