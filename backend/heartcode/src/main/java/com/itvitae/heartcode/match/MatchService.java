package com.itvitae.heartcode.match;

import com.itvitae.heartcode.evaluation.EvaluationRepository;
import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class MatchService {
  private final MatchRepository matchRepository;
  private final EvaluationRepository evaluationRepository;
  private final UserService userService;

  public List<User> getMatchedUsers() {
    return getMatchedUsers(userService.getCurrentUser());
  }

  public List<User> getMatchedUsers(User user) {
    return matchRepository.findForUser(user).stream()
        .map(m -> m.getUser1().getEmail().equals(user.getEmail()) ? m.getUser2() : m.getUser1())
        .toList();
  }

  public Optional<Match> getMatch(User user1, User user2) {
    return matchRepository.findForUser(user1).stream()
        .filter(
            m ->
                m.getUser1().getEmail().equals(user2.getEmail())
                    || m.getUser2().getEmail().equals(user2.getEmail()))
        .findFirst();
  }
}
