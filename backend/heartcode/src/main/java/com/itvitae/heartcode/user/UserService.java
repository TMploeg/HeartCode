package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.profilepictures.ProfilePicture;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService implements UserDetailsService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public Optional<User> findById(String address) {
    return userRepository.findById(address);
  }

  public User save(
      String email,
      String alias,
      String password,
      UserGender gender,
      ProfilePicture profilePicture) {
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

    return userRepository.save(
        new User(email, alias, passwordEncoder.encode(password), gender, profilePicture));
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

  @PostMapping("picture-test")
  public void pictureTest(@RequestBody byte[] bytes) {
    System.out.println("BYTES START");
    for (byte b : bytes) {
      System.out.println(b);
    }
    System.out.println("BYTES END");
  }
}
