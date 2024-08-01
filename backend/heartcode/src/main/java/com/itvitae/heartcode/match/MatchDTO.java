package com.itvitae.heartcode.match;

import com.itvitae.heartcode.user.User;
import java.util.Optional;

public record MatchDTO(String email, String alias) {
  public static Optional<MatchDTO> from(Match match, User currentUser) {
    if (match.getUser1().getEmail().equals(match.getUser2().getEmail())) {
      throw new IllegalArgumentException("match contains the same user twice");
    }

    final User user =
        match.getUser1().getEmail().equals(currentUser.getEmail())
            ? match.getUser2()
            : match.getUser2().getEmail().equals(currentUser.getEmail()) ? match.getUser1() : null;

    return Optional.ofNullable(user).map(u -> new MatchDTO(u.getEmail(), u.getAlias()));
  }
}
