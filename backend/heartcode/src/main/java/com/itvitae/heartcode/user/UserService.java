package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.exceptions.NotFoundException;
import com.itvitae.heartcode.profilepictures.ProfilePicture;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.Optional;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public Optional<User> findById(String address) {
    return userRepository.findById(address);
  }

  public User findRandomUser() {
    User randomUser =
        userRepository
            .findRandomUserExcludingCurrentAndEvaluator(getCurrentUser().getEmail())
            .stream()
            .findFirst()
            .orElse(null);
    if (randomUser != null) {
      return randomUser;
    } else {
      throw new NotFoundException("There are no more users left to evaluate");
    }
  }

  public User save(
      String email,
      String alias,
      String password,
      UserGender gender,
      String dateOfBirthString,
      String bio,
      ProfilePicture profilePicture,
      GenderPreference genderPreference,
      UserRelationshipType relationshipType) {
    if (isInvalidEmail(email) || userWithEmailExists(email)) {
      throw new IllegalArgumentException("email is invalid");
    }

    if (alias.isBlank()) {
      throw new IllegalArgumentException("alias is invalid");
    }

    if (password.isBlank()) {
      throw new IllegalArgumentException("password is invalid");
    }
    if (profilePicture == null) {
      throw new BadRequestException("profilePicture is null");
    }

    LocalDate dateOfBirth =
        parseDateOfBirth(dateOfBirthString)
            .filter(date -> isOver18(date))
            .orElseThrow(() -> new IllegalArgumentException("date of birth is invalid"));

    return userRepository.save(
        new User(
            email,
            alias,
            passwordEncoder.encode(password),
            gender,
            dateOfBirth,
            bio,
            profilePicture,
            genderPreference,
            relationshipType));
  }

  public User update(User user) {
    if (user == null) {
      throw new IllegalArgumentException("user is null");
    }

    return userRepository.save(user);
  }

  public boolean isInvalidEmail(String email) {
    if (email == null) {
      throw new IllegalArgumentException("email is null");
    }

    return !Pattern.compile("^(\\S+)@(\\S+)$").matcher(email).matches();
  }

  public boolean userWithEmailExists(String email) {
    return userRepository.findById(email).isPresent();
  }

  public Optional<LocalDate> parseDateOfBirth(String dateString) {
    if (dateString == null || dateString.isBlank()) {
      Optional.empty();
    }
    String data[] = dateString.split("-");
    dateString = String.join("/", data);

    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d/M/yyyy");

    try {
      return Optional.of(LocalDate.parse(dateString, formatter));
    } catch (DateTimeParseException e) {
      return Optional.empty();
    }
  }

  public boolean isOver18(LocalDate dateOfBirthString) {
    LocalDate localToday = LocalDate.now();

    Period period = Period.between(dateOfBirthString, localToday);

    System.out.println(period.getYears());
    if (period.getYears() >= 18) {
      return true;
    }
    return false;
  }

  public User getCurrentUser() {
    // TODO replace with user in SecurityContextHolder after implementing login
    return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
  }

  public boolean isCorrectPassword(User user, String password) {
    return passwordEncoder.matches(password, user.getPassword());
  }

  public boolean isValidPassword(String password) {
    int numOfUppercase = 0;
    int numOfLowercase = 0;
    int numOfDigits = 0;
    int numOfSpecialChars = 0;
    for (int i = 0; i < password.length(); i++) {
      char ch = password.charAt(i);
      if (Character.isUpperCase(ch)) {
        numOfUppercase++;
      } else if (Character.isLowerCase(ch)) {
        numOfLowercase++;
      } else if (Character.isDigit(ch)) {
        numOfDigits++;
      } else if (!Character.isAlphabetic(ch) && !Character.isDigit(ch)) {
        numOfSpecialChars++;
      }
    }
    return numOfUppercase >= 1
        && numOfLowercase >= 1
        && numOfDigits >= 1
        && numOfSpecialChars >= 1
        && password.length() > 7;
  }

  // ONLY USED BY SPRING SECURITY, USE 'findById' TO GET USERS!!!
  public User loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository
        .findById(username)
        .orElseThrow(() -> new UsernameNotFoundException("user '" + username + "' not found"));
  }
}
