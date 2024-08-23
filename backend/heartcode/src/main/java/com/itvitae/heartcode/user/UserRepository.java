package com.itvitae.heartcode.user;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository
    extends JpaRepository<User, String>, JpaSpecificationExecutor<User> {
  //  @Query(
  //      value =
  //          "SELECT * "
  //              + "FROM users u "
  //              + "WHERE u.email != :currentUserEmail "
  //              + "AND u.email NOT IN ("
  //              + "SELECT e.evaluatee_email "
  //              + "FROM evaluation e "
  //              + "WHERE e.evaluator_email = :currentUserEmail) "
  //              + "ORDER BY RANDOM() LIMIT 1",
  //      nativeQuery = true)
  //  Optional<User> findRandomUserExcludingCurrentAndEvaluator(
  //      @Param("currentUserEmail") String currentUserEmail);
}
