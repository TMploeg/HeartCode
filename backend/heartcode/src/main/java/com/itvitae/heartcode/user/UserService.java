package com.itvitae.heartcode.user;

import java.util.Optional;
import java.util.regex.Pattern;

import com.itvitae.heartcode.exceptions.BadRequestException;
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

  public User save(String email, String alias, String password, UserGender gender) {
    if (isInvalidEmail(email) || userWithEmailExists(email)) {
      throw new IllegalArgumentException("email is invalid");
    }
    if (alias.isBlank()) {
      throw new IllegalArgumentException("alias is invalid");
    }
    if (password.isBlank()) {
      throw new IllegalArgumentException("password is invalid");
    }

    return userRepository.save(new User(email, alias, passwordEncoder.encode(password), gender));
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
      } else if (Character.isLowerCase(ch)){
        numOfLowercase++;
      } else if (Character.isDigit(ch)) {
        numOfDigits++;
      } else if (!Character.isAlphabetic(ch) && !Character.isDigit(ch)) {
        numOfSpecialChars++;
      }
    }
    return numOfUppercase >= 1 && numOfLowercase >= 1 && numOfDigits >= 1 && numOfSpecialChars >= 1 && password.length() > 7;
  }

  // ONLY USED BY SPRING SECURITY, USE 'findById' TO GET USERS!!!
  public User loadUserByUsername(String username) throws UsernameNotFoundException {
    return userRepository
        .findById(username)
        .orElseThrow(() -> new UsernameNotFoundException("user '" + username + "' not found"));
  }
}
