package com.itvitae.heartcode;

import com.itvitae.heartcode.chatmessages.ChatMessage;
import com.itvitae.heartcode.chatmessages.ChatMessageRepository;
import com.itvitae.heartcode.evaluation.Evaluation;
import com.itvitae.heartcode.evaluation.EvaluationRepository;
import com.itvitae.heartcode.match.MatchRepository;
import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserRepository;
import java.time.LocalDateTime;
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
  private final ChatMessageRepository chatMessageRepository;

  @Override
  public void run(String... args) throws Exception {
    seedUsers();
    seedEvaluationsAndMatches();
    seedMessages();
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
  private void seedMessages() {
    if (!chatMessageRepository.findAll().isEmpty()) {
      return;
    }

    List<User> users = userRepository.findAll();

    for (int i = 0; i < users.size(); i++) {
      for (int ii = i + 1; ii < users.size(); ii++) {
        final User user1 = users.get(i);
        final User user2 = users.get(ii);

        if (matchRepository.findForUser(user1).stream()
            .anyMatch(
                m ->
                    m.getUser1().getEmail().equals(user2.getEmail())
                        || m.getUser2().getEmail().equals(user2.getEmail()))) {
          generateSeedMessagesForUsers(user1, user2);
        }
      }
    }
  }

  private void generateSeedMessagesForUsers(User user1, User user2) {
    int continueChance = 70;
    Random r = new Random();
    boolean senderSwitch = false;
    LocalDateTime startDateTime = LocalDateTime.of(2024, 1, 1, 12, 0);
    long totalMessagesSend = 0;
    String[] seedMessages = {
      "Andy loved to sleep on a bed of nails.",
      "Today I dressed my unicorn in preparation for the race.",
      "She wanted a pet platypus but ended up getting a duck and a ferret instead.",
      "The two walked down the slot canyon oblivious to the sound of thunder in the distance.",
      "Barking dogs and screaming toddlers have the unique ability to turn friendly neighbors into cranky enemies.",
      "She was too busy always talking about what she wanted to do to actually do any of it.",
      "He ended up burning his fingers poking someone else's fire.",
      "Mothers spend months of their lives waiting on their children.",
      "We should play with legos at camp.",
      "Grape jelly was leaking out the hole in the roof."
    };

    while (r.nextInt(101) < continueChance) {
      continueChance -= 10;

      int nrOfMessages = r.nextInt(1, 4);
      for (int i = 0; i < nrOfMessages; i++) {
        String messageContent = seedMessages[r.nextInt(seedMessages.length)];
        User sender = senderSwitch ? user1 : user2;
        User receiver = senderSwitch ? user2 : user1;
        LocalDateTime dateTime = startDateTime.plusMinutes(totalMessagesSend * 5);

        chatMessageRepository.save(new ChatMessage(messageContent, sender, receiver, dateTime));

        totalMessagesSend++;
      }

      senderSwitch = !senderSwitch;
    }
  }
}
