package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.security.AuthTokenDTO;
import com.itvitae.heartcode.security.JwtService;
import jakarta.transaction.Transactional;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
    if (registerDTO.password() == null || !userService.isValidPassword(registerDTO.password())) {
      throw new BadRequestException("password is not valid");
    }

    if (registerDTO.dateOfBirth() == null || registerDTO.dateOfBirth().isBlank()) {
      throw new BadRequestException("Date of birth is required");
    }
    if (registerDTO.dateOfBirth() == null) {
      throw new BadRequestException("Date of birth is not a real date");
    }

    if (registerDTO.gender() == null) {
      throw new BadRequestException("gender is required");
    } else if (registerDTO.gender().isBlank()) {
      throw new BadRequestException("gender must have at least one character");
    }

    if (registerDTO.relationshipType() == null) {
      throw new BadRequestException("relationshipType is required");
    } else if (registerDTO.relationshipType().isBlank()) {
      throw new BadRequestException("relationshipType must have at least one character");
    }

    userService
        .parseDateOfBirth(registerDTO.dateOfBirth())
        .filter(date -> userService.isOver18(date))
        .orElseThrow(
            () ->
                new BadRequestException(
                    "date of birth field doesn't include a valid date or is younger then 18"));

    UserGender gender =
        UserGender.parse(registerDTO.gender())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "gender is invalid, valid options include: ["
                            + getGenderOptionsString()
                            + "]"));

    UserRelationshipType relationshipType =
        UserRelationshipType.parse(registerDTO.relationshipType())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "relationshipType is invalid, valid options include: ["
                            + getRelationshipTypeOptionsString()
                            + "]"));

    User user =
        userService.save(
            registerDTO.email(),
            registerDTO.alias(),
            registerDTO.password(),
            registerDTO.dateOfBirth(),
            gender,
            relationshipType,
            registerDTO.bio());

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

  @ResponseStatus(HttpStatus.NO_CONTENT)
  @PatchMapping("account")
  public void updateProfile(@RequestBody UpdateProfileDTO updateProfileDTO) {
    User user = userService.getCurrentUser();
    List<String> errors = new ArrayList<>();

    updateAlias(updateProfileDTO.alias(), user).ifPresent(errors::add);
    updateGender(updateProfileDTO.gender(), user).ifPresent(errors::add);
    updateBio(updateProfileDTO.bio(), user).ifPresent(errors::add);

    if (!errors.isEmpty()) {
      throw new BadRequestException(String.join(";", errors));
    }

    userService.update(user);
  }

  private Optional<String> updateAlias(String newAlias, User user) {
    if (newAlias == null) {
      return Optional.empty();
    }

    if (newAlias.isBlank()) {
      return Optional.of("alias is invalid");
    }

    user.setAlias(newAlias);
    return Optional.empty();
  }

  private Optional<String> updateBio(String newBio, User user) {
    if (newBio == null) {
      return Optional.empty();
    }

    user.setBio(newBio);
    return Optional.empty();
  }

  private Optional<String> updateGender(String newGender, User user) {
    if (newGender == null) {
      return Optional.empty();
    }

    if (newGender.isBlank()) {
      return Optional.of("gender must have at least one character");
    }

    Optional<UserGender> gender = UserGender.parse(newGender);
    gender.ifPresent(user::setGender);

    return gender.isPresent()
        ? Optional.empty()
        : Optional.of("gender is invalid, valid options: [" + getGenderOptionsString() + "]");
  }

  private static String getGenderOptionsString() {
    return String.join(", ", Arrays.stream(UserGender.values()).map(UserGender::getName).toList());
  }

  private static String getRelationshipTypeOptionsString() {
    return String.join(
        ", ",
        Arrays.stream(UserRelationshipType.values()).map(UserRelationshipType::getName).toList());
  }

  @GetMapping("validate-token")
  public boolean isValidToken(@RequestParam String token) {
    if (token == null) {
      throw new BadRequestException("token is required");
    }

    return jwtService.readToken(token).isPresent();
  }
}
