package com.itvitae.heartcode.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository
    extends JpaRepository<User, String> {
  String USER_ALIAS = "u";
  String EVALUATION_ALIAS = "e";

  @Query(
      "SELECT u "
          + "FROM users u "
          + "WHERE u.email != :email "
          + "AND u NOT IN ("
          + "SELECT e.evaluatee "
          + "FROM u.reveivedEvaluations e "
          + "WHERE e.evaluator.email = :email) "
          + "AND u.gender IN :preferredGenders "
          + "AND u.relationshipType IN :preferredRelationshipTypes "
          + "ORDER BY RANDOM() LIMIT 1")
  Optional<User> getRandomUser(
      @Param("email") String currentUserEmail,
      @Param("preferredGenders") List<UserGender> preferredGenders,
      @Param("preferredRelationshipTypes") List<UserRelationshipType> preferredRelationShipTypes);
}
