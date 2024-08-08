package com.itvitae.heartcode.match;

import com.itvitae.heartcode.evaluation.Evaluation;
import com.itvitae.heartcode.evaluation.EvaluationRepository;
import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MatchService {
  private final MatchRepository matchRepository;
  private final EvaluationRepository evaluationRepository;
  private final UserService userService;

  public Optional<Match> createMatch(User evaluator, User evaluatee, Boolean isLiked) {
    if (getMatchedUsers(evaluator).contains(evaluatee)) {
      return Optional.empty();
    }

    Optional<Evaluation> possibleEvaluation =
        evaluationRepository.findByEvaluationIdEvaluatorAndEvaluationIdEvaluatee(
            evaluatee, evaluator);

    if (!isLiked || possibleEvaluation.filter(evaluation1 -> evaluation1.isLiked()).isEmpty()) {
      return Optional.empty();
    }
    return Optional.of(matchRepository.save(new Match(evaluator, evaluatee)));
  }

  public List<Match> getAll() {
    return matchRepository.findAll().stream().filter(this::containsTestUser).toList();
  }

  public List<User> getMatchedUsers() {
    return getMatchedUsers(userService.getCurrentUser());
  }

  public List<User> getMatchedUsers(User user) {
    return matchRepository.findForUser(user).stream()
        .map(m -> m.getUser1().getEmail().equals(user.getEmail()) ? m.getUser2() : m.getUser1())
        .toList();
  }

  public boolean containsTestUser(Match match) {
    return match.getUser1().getAlias().equals(User.TEST_USER_NAME)
        || match.getUser2().getAlias().equals(User.TEST_USER_NAME);
  }
}
