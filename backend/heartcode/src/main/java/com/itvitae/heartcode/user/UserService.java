package com.itvitae.heartcode.user;

import java.util.Optional;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
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

  public User save(String email, String alias, String password) {
    if (isInvalidEmail(email) || userWithEmailExists(email)) {
      throw new IllegalArgumentException("email is invalid");
    }
    if (alias.isBlank()) {
      throw new IllegalArgumentException("alias is invalid");
    }
    if (password.isBlank()) {
      throw new IllegalArgumentException("password is invalid");
    }

    return userRepository.save(new User(email, alias, passwordEncoder.encode(password)));
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

  public User getCurrentUser() {
    // TODO replace with user in SecurityContextHolder after implementing login
    return userRepository.findAll().stream()
        .filter(u -> u.getAlias().equals(User.TEST_USER_NAME))
        .findFirst()
        .get();
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
