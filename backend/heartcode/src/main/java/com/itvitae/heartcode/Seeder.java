package com.itvitae.heartcode;

import com.itvitae.heartcode.evaluation.Evaluation;
import com.itvitae.heartcode.evaluation.EvaluationController;
import com.itvitae.heartcode.evaluation.EvaluationRepository;
import com.itvitae.heartcode.evaluation.NewEvaluationDTO;
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
  private final MatchRepository matchRepository;
  private final EvaluationRepository evaluationRepository;
  private final EvaluationController evaluationController;

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

    int iterationCount = 15;

    List<User> users = userRepository.findAll();
    Random r = new Random();
    List<Evaluation> evaluations = new ArrayList<>();

    for (int i = 0; i < iterationCount; i++) {
      NewEvaluationDTO evaluation =
          new NewEvaluationDTO(
              users.get(r.nextInt(9)).getEmail(),
              users.get(r.nextInt(9)).getEmail(),
              r.nextBoolean());
      evaluationController.createEvaluationAndCheck(evaluation);
    }
  }
}
