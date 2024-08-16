package com.itvitae.heartcode.user;

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
public class UserService implements UserDetailsService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public Optional<User> findById(String address) {
    return userRepository.findById(address);
  }

  public User save(String email, String alias, String password, String dateOfBirthString) {
    if (isInvalidEmail(email) || userWithEmailExists(email)) {
      throw new IllegalArgumentException("email is invalid");
    }

    if (alias.isBlank()) {
      throw new IllegalArgumentException("alias is invalid");
    }

    if (password.isBlank()) {
      throw new IllegalArgumentException("password is invalid");
    }

    LocalDate dateOfBirth =
        parseDateOfBirth(dateOfBirthString)
            .filter(date -> isOver18(date))
            .orElseThrow(() -> new IllegalArgumentException("date of birth is invalid"));

    return userRepository.save(
        new User(email, alias, passwordEncoder.encode(password), dateOfBirth));
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

  // ONLY USED BY SPRING SECURITY, USE 'findById' TO GET USERS!!!
  public User loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository
        .findById(username)
        .orElseThrow(() -> new UsernameNotFoundException("user '" + username + "' not found"));
  }
}
