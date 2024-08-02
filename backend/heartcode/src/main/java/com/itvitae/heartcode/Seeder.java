package com.itvitae.heartcode;

import com.itvitae.heartcode.evaluation.Evaluation;
import com.itvitae.heartcode.evaluation.EvaluationRepository;
import com.itvitae.heartcode.match.Match;
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

  @Override
  public void run(String... args) throws Exception {
    seedUsers();
    seedMatches();
    seedEvaluations();
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

  private void seedMatches() {
    if (matchRepository.count() != 0) {
      return;
    }

    List<User> users = userRepository.findAll();
    Random r = new Random();
    List<Match> matches = new ArrayList<>();

    for (int i = 0; i < users.size(); i++) {
      for (int j = i + 1; j < users.size(); j++) {
        if (r.nextInt(5) == 0) {
          matches.add(new Match(users.get(i), users.get(j)));
        }
      }
    }

    matchRepository.saveAll(matches);
  }

  private void seedEvaluations() {
    if (evaluationRepository.count() != 0) {
      return;
    }

    List<User> users = userRepository.findAll();
    Random r = new Random();
    List<Evaluation> evaluations = new ArrayList<>();

    for (int i = 0; i < users.size(); i++) {
      for (int j = i + 1; j < users.size(); j++) {
        if (r.nextInt(5) == 0) {
          evaluations.add(new Evaluation(users.get(i), users.get(j), r.nextBoolean()));
        }
      }
    }

    evaluationRepository.saveAll(evaluations);
  }
}
