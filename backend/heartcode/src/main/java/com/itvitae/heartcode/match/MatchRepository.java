package com.itvitae.heartcode.match;

import com.itvitae.heartcode.user.User;
import java.util.Set;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface MatchRepository extends JpaRepository<Match, UUID> {
  @Query("SELECT m FROM Match m WHERE m.user1 = ?1 OR m.user2 = ?1")
  Set<Match> findForUser(User user);
}
