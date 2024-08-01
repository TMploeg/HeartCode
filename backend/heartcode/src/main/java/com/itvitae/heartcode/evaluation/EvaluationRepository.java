package com.itvitae.heartcode.evaluation;

import com.itvitae.heartcode.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation, User> {}
