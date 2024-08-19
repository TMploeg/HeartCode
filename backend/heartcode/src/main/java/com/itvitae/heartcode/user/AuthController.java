package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.profilepictures.ProfilePicture;
import com.itvitae.heartcode.profilepictures.ProfilePictureService;
import com.itvitae.heartcode.security.AuthTokenDTO;
import com.itvitae.heartcode.security.JwtService;
import java.util.Arrays;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin("${app.cors-allowed-origins}")
@RequiredArgsConstructor
public class AuthController {
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

    if (registerDTO.dateOfBirth() == null || registerDTO.dateOfBirth().isBlank()) {
      throw new BadRequestException("Date of birth is required");
    }
    if (registerDTO.dateOfBirth() == null) {
      throw new BadRequestException("Date of birth is not a real date");
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

    userService
        .parseDateOfBirth(registerDTO.dateOfBirth())
        .filter(date -> userService.isOver18(date))
        .orElseThrow(
            () ->
                new BadRequestException(
                    "date of birth field doesn't include a valid date or is younger then 18"));

    ProfilePicture profilePicture = profilePictureService.save(registerDTO.profilePicture());

    User user =
        userService.save(
            registerDTO.email(),
            registerDTO.alias(),
            registerDTO.password(),
            gender,
            registerDTO.dateOfBirth(),
            registerDTO.bio(),
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

  private static String getGenderOptionsString() {
    return String.join(", ", Arrays.stream(UserGender.values()).map(UserGender::getName).toList());
  }
}
