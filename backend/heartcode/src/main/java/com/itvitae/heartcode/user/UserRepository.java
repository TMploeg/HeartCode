package com.itvitae.heartcode.user;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface UserRepository extends JpaRepository<User, String> {
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
          + "AND DATE_PART('year', AGE(u.dateOfBirth)) >= :minPreferredAge "
          + "AND DATE_PART('year', AGE(u.dateOfBirth)) <= :maxPreferredAge "
          + "ORDER BY RANDOM() LIMIT 1")
  Optional<User> getRandomUser(
      @Param("email") String currentUserEmail,
      @Param("preferredGenders") List<UserGender> preferredGenders,
      @Param("preferredRelationshipTypes") List<UserRelationshipType> preferredRelationShipTypes,
      @Param("minPreferredAge") int minPreferredAge,
      @Param("maxPreferredAge") int maxPreferredAge);

  @Query(
      "SELECT u "
          + "FROM users u "
          + "WHERE u.email != :email "
          + "AND u IN ("
          + "SELECT e.evaluator "
          + "FROM Evaluation e "
          + "WHERE e.evaluatee.email = :email "
          + "AND e.liked = true) "
          + "AND u NOT IN ("
          + "SELECT e.evaluatee "
          + "FROM u.reveivedEvaluations e "
          + "WHERE e.evaluator.email = :email) "
          + "ORDER BY RANDOM() LIMIT 1")
  Optional<User> getRandomLikedUser(@Param("email") String currentUserEmail);

  @Query(
      "SELECT DATE_PART('year', AGE(u.dateOfBirth)) "
          + "FROM users u "
          + "ORDER BY u.dateOfBirth DESC "
          + "LIMIT 1")
  int getLowestAge();

  @Query(
      "SELECT DATE_PART('year', AGE(u.dateOfBirth)) "
          + "FROM users u "
          + "ORDER BY u.dateOfBirth ASC "
          + "LIMIT 1")
  int getHighestAge();
}
