package com.itvitae.heartcode.match;

import com.itvitae.heartcode.user.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MatchService {
  private final MatchRepository matchRepository;

  public List<Match> getAll() {
    return matchRepository.findAll().stream().filter(this::containsTestUser).toList();
  }

  public boolean containsTestUser(Match match) {
    return match.getUser1().getAlias().equals(User.TEST_USER_NAME)
        || match.getUser2().getAlias().equals(User.TEST_USER_NAME);
  }
}
