package com.itvitae.heartcode.user;

import com.itvitae.heartcode.evaluation.Evaluation;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;
import org.springframework.data.jpa.domain.Specification;

public class UserSpecification {
  public static Specification<User> isNotSelf(String email) {
    return ((root, query, criteriaBuilder) -> criteriaBuilder.notEqual(root.get("email"), email));
  }

  public static Specification<User> isNotEvaluated(User user) {
    return ((root, query, criteriaBuilder) -> {
      Subquery<Evaluation> subquery = query.subquery(Evaluation.class);
      Root<Evaluation> subQueryRoot = subquery.from(Evaluation.class);
      Predicate predicate =
          criteriaBuilder.equal(subQueryRoot.get("evaluator").get("email"), user.getEmail());

      return root.get("email")
          .in(subquery.select(subQueryRoot.get("evaluatee").get("email")).where(predicate))
          .not();
      //        criteriaBuilder.not(
      //            criteriaBuilder
      //                .in(root.get("reveivedEvaluations").get("evaluator").get("email"))
      //                .value(user.getEmail())));

    });
  }
}

// geslacht
// mogelijk relatie type

// jou geliked
