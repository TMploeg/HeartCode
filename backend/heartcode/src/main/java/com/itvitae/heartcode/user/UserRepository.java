package com.itvitae.heartcode.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository
    extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
  @Query(
      "SELECT u "
          + "FROM users u "
          + "WHERE u.email != :currentUserEmail "
          + "WHERE u.genderPreference = "
          + "AND u NOT IN ("
          + "SELECT e.evaluatee "
          + "FROM u.reveivedEvaluations e "
          + "WHERE e.evaluator.email = :currentUserEmail) "
          + "ORDER BY RANDOM() LIMIT 1")
  Optional<User> getRandomUser(@Param("currentUserEmail") String currentUserEmail);
}
