package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.match.Match;
import com.itvitae.heartcode.match.MatchRepository;
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
  private final MatchRepository matchRepository;

  public Evaluation createEvaluation(User evaluator, User evaluatee, boolean isLiked) {
    if (getEvaluation(evaluator, evaluatee).isPresent()) {
      return null;
    }

    Evaluation evaluation =
        evaluationRepository.save(new Evaluation(evaluator, evaluatee, isLiked));

    if (isLiked) {
      getEvaluation(evaluatee, evaluator)
          .filter(Evaluation::isLiked)
          .ifPresent(eval -> matchRepository.save(new Match(evaluator, evaluatee)));
    }

    return evaluation;
  }

  public Optional<Evaluation> getEvaluation(User evaluator, User evaluatee) {
    return evaluationRepository.findByEvaluatorAndEvaluatee(evaluator, evaluatee);
  }
}
