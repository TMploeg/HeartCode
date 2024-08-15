package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.security.AuthTokenDTO;
import com.itvitae.heartcode.security.JwtService;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/users")
@CrossOrigin("${app.cors-allowed-origins}")
@Transactional
public class UserController {
  private final UserService userService;
  private final JwtService jwtService;

  @PostMapping("register")
  public AuthTokenDTO register(@RequestBody RegisterDTO registerDTO) {
    if (registerDTO.email() == null) {
      throw new BadRequestException("email is required");
    } else if (userService.isInvalidEmail(registerDTO.email())
        || userService.userWithEmailExists(registerDTO.email())) {
      throw new BadRequestException("email is invalid");
    }
    if (registerDTO.alias() == null || registerDTO.alias().isBlank()) {
      throw new BadRequestException("alias is required");
    }
    if (registerDTO.password() == null || registerDTO.password().isBlank() || registerDTO.password().length() < 7) {
      throw new BadRequestException("password is too short");
    } else if (!userService.isValidPassword(registerDTO.password())) {
      throw new BadRequestException("password is not valid");
    }

    User user = userService.save(registerDTO.email(), registerDTO.alias(), registerDTO.password());

    return new AuthTokenDTO(
        jwtService
            .generateTokenForUser(user.getEmail())
            .orElseThrow(
                () -> new RuntimeException("could not generate token for unknown reasons")));
  }

  @PostMapping("login")
  public AuthTokenDTO login(@RequestBody LoginDTO authDTO) {
    if (authDTO.email() == null || authDTO.password() == null) {
      throw new BadRequestException("email and password are required");
    }

    userService
        .findById(authDTO.email())
        .filter(user -> userService.isCorrectPassword(user, authDTO.password()))
        .orElseThrow(() -> new BadRequestException("username or password is incorrect"));

    return new AuthTokenDTO(
        jwtService
            .generateTokenForUser(authDTO.email())
            .orElseThrow(
                () -> new RuntimeException("could not generate token for unknown reasons")));
  }

  @GetMapping("account")
  public ResponseEntity<UserDTO> getCurrentUser() {
    return ResponseEntity.ok(UserDTO.from(userService.getCurrentUser()));
  }

  @GetMapping("{id}")
  public ResponseEntity<UserDTO> getUserById(@PathVariable String id) {
    Optional<User> user = userService.findById(id);
    if (!userService.userWithEmailExists(id)) return ResponseEntity.notFound().build();
    return ResponseEntity.ok(UserDTO.from(user.get()));
  }

  //  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PatchMapping("account")
  public UserDTO updateProfile(@RequestBody UpdateProfileDTO updateProfileDTO) {
    User user = userService.getCurrentUser();
    List<String> errors = new ArrayList<>();

    if (updateProfileDTO.alias() != null) {
      if (!updateProfileDTO.alias().isBlank()) {
        user.setAlias(updateProfileDTO.alias());
      } else {
        errors.add("alias is invalid");
      }
    }

    if (!errors.isEmpty()) {
      throw new BadRequestException(String.join(";", errors));
    }

    userService.update(user);

    return UserDTO.from(user);
  }
}
