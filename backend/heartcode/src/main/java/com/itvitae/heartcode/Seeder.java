package com.itvitae.heartcode;

import com.itvitae.heartcode.evaluation.Evaluation;
import com.itvitae.heartcode.evaluation.EvaluationRepository;
import com.itvitae.heartcode.match.MatchRepository;
import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Stream;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class Seeder implements CommandLineRunner {
  private final UserRepository userRepository;
  private final EvaluationRepository evaluationRepository;
  private final MatchRepository matchRepository;

  @Override
  public void run(String... args) throws Exception {
    seedUsers();
    seedEvaluationsAndMatches();
  }

  private void seedUsers() {
    if (userRepository.count() != 0) {
      return;
    }

    userRepository.saveAll(
        Stream.of(
                User.TEST_USER_NAME,
                "user0",
                "user1",
                "user2",
                "user3",
                "user4",
                "user5",
                "user6",
                "user7",
                "user8",
                "user9")
            .map(s -> new User(s + "@heartcode.com", s))
            .toList());
  }

  private void seedEvaluationsAndMatches() {
    if (evaluationRepository.count() != 0) {
      return;
    }

    List<User> users = userRepository.findAll();
    Random r = new Random();
    List<Evaluation> evaluations = new ArrayList<>();

    for (int u1 = 0; u1 < users.size(); u1++) {
      for (int u2 = 0; u2 < users.size(); u2++) {
        if (u1 != u2) {
          Evaluation evaluation = new Evaluation(users.get(u1), users.get(u2), r.nextBoolean());
          evaluations.add(evaluation);
        }
      }
    }
    evaluationRepository.saveAll(evaluations);
  }

  /*  private void seedEvaluationsAndMatches() {
    if (evaluationRepository.count() != 0) {
      return;
    }

    int iterationCount = 15;

    List<User> users = userRepository.findAll();
    Random r = new Random();
    List<Evaluation> evaluations = new ArrayList<>();

    for (int i = 0; i < iterationCount; i++) {
      NewEvaluationDTO evaluation =
          new NewEvaluationDTO(
              users.get(r.nextInt((int) userRepository.count())).getEmail(),
              users.get(r.nextInt((int) userRepository.count())).getEmail(),
              r.nextBoolean());
      evaluationController.createEvaluationAndCheck(evaluation);
    }
  }*/
}
