package com.itvitae.heartcode.user;

import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public Optional<User> findById(String address){
        return userRepository.findById(address);
    }

  public User save(User user) {
    if (user.getEmail() == null) {
      throw new IllegalArgumentException("email is null");
    }
    if (user.getAlias() == null) {
      throw new IllegalArgumentException("alias is null");
    }

    if (!isValidEmail(user.getEmail()) || userWithEmailExists(user.getEmail())) {
      throw new IllegalArgumentException("email is invalid");
    }
    if (user.getAlias().isBlank()) {
      throw new IllegalArgumentException("alias is invalid");
    }

    return userRepository.save(user);
  }

  public boolean isValidEmail(String email) {
    if (email == null) {
      throw new IllegalArgumentException("email is null");
    }

    return Pattern.compile("^(\\S+)@(\\S+)$").matcher(email).matches();
  }

  public boolean userWithEmailExists(String email) {
    return userRepository.findById(email).isPresent();
  }

  // temporary method, remove after implementing login
  public User getTestUser() {
    return userRepository.findAll().stream()
        .filter(u -> u.getAlias().equals(User.TEST_USER_NAME))
        .findFirst()
        .get();
  }
}
