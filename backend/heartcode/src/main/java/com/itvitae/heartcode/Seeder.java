package com.itvitae.heartcode;

import com.itvitae.heartcode.chatmessages.ChatMessage;
import com.itvitae.heartcode.chatmessages.ChatMessageRepository;
import com.itvitae.heartcode.evaluation.EvaluationService;
import com.itvitae.heartcode.match.Match;
import com.itvitae.heartcode.match.MatchService;
import com.itvitae.heartcode.profilepictures.ProfilePicture;
import com.itvitae.heartcode.profilepictures.ProfilePictureRepository;
import com.itvitae.heartcode.user.*;
import jakarta.transaction.Transactional;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.apache.commons.io.IOUtils;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Transactional
public class Seeder implements CommandLineRunner {
  private final UserRepository userRepository;
  private final ChatMessageRepository chatMessageRepository;
  private final ProfilePictureRepository profilePictureRepository;
  private final PasswordEncoder passwordEncoder;
  private final MatchService matchService;
  private final EvaluationService evaluationService;

  private static final String SEED_DATA_FILE_NAME = "seed_user_data.json";
  private static final String SEED_USER_EMAIL_APPENDIX = "@heartcode.com";
  private static final String SEED_USER_PASSWORD_APPENDIX = "_password";

  private static final String PLACEHOLDER_PROFILE_PICTURE_FILE_NAME = "placeholder_profile_picture";

  private static final double EVALUATION_CREATION_CHANCE = 0.3;

  private static final int MESSAGE_BLOCK_MIN_SIZE = 1;
  private static final int MESSAGE_BLOCK_MAX_SIZE = 3;
  private static final double MESSAGE_CREATION_INITIAL_CHANCE = 1.0;
  private static final double MESSAGE_CREATION_CHANCE_DECREMENT = 0.1;
  private static final LocalDateTime MESSAGE_START_DATETIME = LocalDateTime.of(2024, 1, 1, 12, 0);
  private static final int MESSAGE_TIME_INCREMENT = 5;
  private static final String[] SEED_MESSAGES_CONTENT = {
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

    JSONArray jsonArray;
    try {
      jsonArray = getUsersJSONArray();
    } catch (IOException ex) {
      System.err.println("Seed data file not found");
      return;
    }

    List<User> users = new ArrayList<>();
    byte[] placeholderImageBytes = getPlaceholderImageBytes();

    for (int i = 0; i < jsonArray.length(); i++) {
      users.add(getUserFromJSONObject(jsonArray.getJSONObject(i), placeholderImageBytes));
    }

    userRepository.saveAll(users);
  }

  private JSONArray getUsersJSONArray() throws IOException {
    ClassPathResource seedDataFile = new ClassPathResource(SEED_DATA_FILE_NAME);
    String json = IOUtils.toString(seedDataFile.getInputStream(), StandardCharsets.UTF_8);
    return new JSONArray(json);
  }

  private User getUserFromJSONObject(JSONObject obj, byte[] profilePictureBytes) {
    String name = obj.getString(SeedDataField.NAME.getName());
    String birthday = obj.getString(SeedDataField.BIRTHDAY.getName());
    int age = obj.getInt(SeedDataField.AGE.getName());

    UserGender gender = obj.getEnum(UserGender.class, SeedDataField.GENDER.getName());
    GenderPreference genderPreference =
        obj.getEnum(GenderPreference.class, SeedDataField.GENDER_PREFERENCE.getName());
    UserRelationshipType relationshipType =
        obj.getEnum(UserRelationshipType.class, SeedDataField.RELATIONSHIP_TYPE.getName());

    String email = name.toLowerCase() + SEED_USER_EMAIL_APPENDIX;
    String password = passwordEncoder.encode(name + SEED_USER_PASSWORD_APPENDIX);
    LocalDate dateOfBirth = parseDateOfBirth(birthday, age);

    ProfilePicture profilePicture =
        profilePictureRepository.save(new ProfilePicture(profilePictureBytes));

    User newUser =
        new User(
            email,
            name,
            password,
            gender,
            dateOfBirth,
            "",
            profilePicture,
            genderPreference,
            relationshipType);

    parseAgePreference(obj).ifPresent(newUser::setAgePreference);

    return newUser;
  }

  private LocalDate parseDateOfBirth(String rawBirthday, int age) {
    if (rawBirthday == null || rawBirthday.isBlank()) {
      throw new IllegalArgumentException("rawBirthday is null or blank");
    }

    String[] splitBirthday = rawBirthday.split("/");

    if (splitBirthday.length != 2) {
      throw new IllegalArgumentException("rawBirthday format is invalid, valid format: 'mm/dd'");
    }

    try {
      int month = Integer.parseInt(splitBirthday[0]);
      int day = Integer.parseInt(splitBirthday[1]);

      return LocalDate.of(LocalDate.now().getYear(), month, day).minusYears(age);
    } catch (NumberFormatException numberFormatException) {
      throw new IllegalArgumentException("rawBirthday is invalid, must be numbers");
    } catch (DateTimeException dateTimeException) {
      throw new IllegalArgumentException("rawBirthday is invalid, must be a real date");
    }
  }

  private Optional<AgePreference> parseAgePreference(JSONObject obj) {
    if (!obj.has(SeedDataField.AGE_PREFERENCE.getName())) {
      return Optional.empty();
    }

    JSONObject agePreferenceObj = obj.getJSONObject(SeedDataField.AGE_PREFERENCE.getName());

    Integer minAgePreference = agePreferenceObj.getInt(SeedDataField.MIN_AGE_PREFERENCE.getName());
    Integer maxAgePreference = null;
    if (agePreferenceObj.has(SeedDataField.MAX_AGE_PREFERENCE.getName())) {
      maxAgePreference = agePreferenceObj.getInt(SeedDataField.MAX_AGE_PREFERENCE.getName());
    }

    return Optional.of(new AgePreference(minAgePreference, maxAgePreference));
  }

  private byte[] getPlaceholderImageBytes() {
    try (InputStream fileStream =
        HeartCodeApplication.class
            .getClassLoader()
            .getResourceAsStream(PLACEHOLDER_PROFILE_PICTURE_FILE_NAME)) {
      if (fileStream == null) {
        throw new RuntimeException("file stream not found");
      }

      return fileStream.readAllBytes();
    } catch (IOException ex) {
      throw new RuntimeException(ex.getMessage(), ex);
    }
  }

  private void seedEvaluationsAndMatches() {
    if (evaluationService.count() != 0) {
      return;
    }

    List<User> users = userRepository.findAll();
    Random r = new Random();

    for (int evaluator = 0; evaluator < users.size(); evaluator++) {
      for (int evaluatee = 0; evaluatee < users.size(); evaluatee++) {
        if (evaluator != evaluatee && r.nextDouble() <= EVALUATION_CREATION_CHANCE) {
          evaluationService.createEvaluation(
              users.get(evaluator), users.get(evaluatee), r.nextBoolean());
        }
      }
    }
  }

  private void seedMessages() {
    if (!chatMessageRepository.findAll().isEmpty()) {
      return;
    }

    List<User> users = userRepository.findAll();

    for (int i = 0; i < users.size(); i++) {
      for (int ii = i + 1; ii < users.size(); ii++) {
        matchService.getMatch(users.get(i), users.get(ii)).ifPresent(this::generateSeedMessages);
      }
    }
  }

  private void generateSeedMessages(Match match) {
    double continueChance = MESSAGE_CREATION_INITIAL_CHANCE;
    Random r = new Random();

    User sender = match.getUser1();
    User receiver = match.getUser2();
    LocalDateTime messageDateTime = MESSAGE_START_DATETIME;

    while (r.nextDouble() < continueChance) {
      continueChance -= MESSAGE_CREATION_CHANCE_DECREMENT;

      int nrOfMessages = r.nextInt(MESSAGE_BLOCK_MIN_SIZE, MESSAGE_BLOCK_MAX_SIZE + 1);
      for (int i = 0; i < nrOfMessages; i++) {
        String messageContent = getRandomMessageContent();

        chatMessageRepository.save(
            new ChatMessage(messageContent, sender, receiver, messageDateTime));

        messageDateTime = messageDateTime.plusMinutes(MESSAGE_TIME_INCREMENT);
      }

      User temp = sender;
      sender = receiver;
      receiver = temp;
    }
  }

  private String getRandomMessageContent() {
    return SEED_MESSAGES_CONTENT[new Random().nextInt(SEED_MESSAGES_CONTENT.length)];
  }
}

@Getter
enum SeedDataField {
  NAME("name"),
  GENDER("gender"),
  BIRTHDAY("birthday"),
  AGE("age"),
  GENDER_PREFERENCE("gender_preference"),
  RELATIONSHIP_TYPE("relationship_type"),
  AGE_PREFERENCE("age_preference"),
  MIN_AGE_PREFERENCE("min_age"),
  MAX_AGE_PREFERENCE("max_age");

  private final String name;

  SeedDataField(String name) {
    this.name = name;
  }
}
