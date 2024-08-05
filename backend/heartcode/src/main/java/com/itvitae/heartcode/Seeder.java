package com.itvitae.heartcode;

import com.itvitae.heartcode.chatmessages.ChatMessage;
import com.itvitae.heartcode.chatmessages.ChatMessageRepository;
import com.itvitae.heartcode.match.Match;
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
  private final MatchRepository matchRepository;
  private final ChatMessageRepository chatMessageRepository;

  @Override
  public void run(String... args) throws Exception {
    seedUsers();
    seedMatches();
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

  private void seedMessages() {
    if (!chatMessageRepository.findAll().isEmpty()) {
      return;
    }

    User testUser =
        userRepository.findAll().stream()
            .filter(u -> u.getAlias().equals(User.TEST_USER_NAME))
            .findFirst()
            .get();
    List<User> otherUsers =
        userRepository.findAll().stream()
            .filter(u -> !u.getEmail().equals(testUser.getEmail()))
            .toList();

    for (User user : otherUsers) {
      generateSeedMessagesForUser(testUser, user);
    }
  }

  private void generateSeedMessagesForUser(User testUser, User otherUser) {
    int continueChance = 70;
    Random r = new Random();
    boolean senderSwitch = false;
    LocalDateTime startDateTime = LocalDateTime.of(2024, 1, 1, 12, 0);
    long totalMessagesSend = 0;

    while (r.nextInt(101) < continueChance) {
      continueChance -= 10;

      int nrOfMessages = r.nextInt(1, 4);
      for (int i = 0; i < nrOfMessages; i++) {
        String messageContent = "Awesome Chat Message Content!!!";
        User sender = senderSwitch ? testUser : otherUser;
        User receiver = senderSwitch ? otherUser : testUser;
        LocalDateTime dateTime = startDateTime.plusMinutes(totalMessagesSend * 5);

        chatMessageRepository.save(new ChatMessage(messageContent, sender, receiver, dateTime));

        totalMessagesSend++;
      }

      senderSwitch = !senderSwitch;
    }
  }
}
