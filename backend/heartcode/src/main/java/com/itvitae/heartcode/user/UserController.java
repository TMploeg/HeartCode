package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.profilepictures.ProfilePicture;
import com.itvitae.heartcode.profilepictures.ProfilePictureService;
import com.itvitae.heartcode.security.AuthTokenDTO;
import com.itvitae.heartcode.security.JwtService;
import jakarta.transaction.Transactional;
import java.util.*;
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
  private final ProfilePictureService profilePictureService;

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

    if (registerDTO.gender() == null) {
      throw new BadRequestException("gender is required");
    } else if (registerDTO.gender().isBlank()) {
      throw new BadRequestException("gender must have at least one character");
    }

    if (registerDTO.profilePicture() == null) {
      throw new BadRequestException("profilePicture is required");
    } else if (registerDTO.profilePicture().isEmpty()) {
      throw new BadRequestException("profilePicture is empty");
    }

    UserGender gender =
        UserGender.parse(registerDTO.gender())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "gender is invalid, valid options include: ["
                            + getGenderOptionsString()
                            + "]"));

    ProfilePicture profilePicture = profilePictureService.save(registerDTO.profilePicture());

    User user =
        userService.save(
            registerDTO.email(),
            registerDTO.alias(),
            registerDTO.password(),
            gender,
            profilePicture);

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
    updateProfilePicture(updateProfileDTO.profilePicture(), user).ifPresent(errors::add);

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

  private Optional<String> updateProfilePicture(Map<Long, Byte> profilePicture, User user) {
    if (profilePicture == null) {
      return Optional.empty();
    }

    if (profilePicture.isEmpty()) {
      return Optional.of("profilePicture is empty");
    }

    profilePictureService.update(user.getProfilePicture(), profilePicture);

    return Optional.empty();
  }

  private static String getGenderOptionsString() {
    return String.join(", ", Arrays.stream(UserGender.values()).map(UserGender::getName).toList());
  }

  @GetMapping("validate-token")
  public boolean isValidToken(@RequestParam String token) {
    if (token == null) {
      throw new BadRequestException("token is required");
    }

    return jwtService.readToken(token).isPresent();
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
