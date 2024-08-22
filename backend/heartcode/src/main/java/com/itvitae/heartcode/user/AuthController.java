package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.profilepictures.ProfilePictureService;
import com.itvitae.heartcode.security.AuthTokenDTO;
import com.itvitae.heartcode.security.JwtService;
import java.util.Arrays;
import java.util.Optional;
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
    } else if (userService.isInvalidEmail(registerDTO.email())) {
      throw new BadRequestException("email not valid");
    } else if (userService.userWithEmailExists(registerDTO.email())) {
      throw new BadRequestException("email is already in use");
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

    if (registerDTO.relationshipType() == null) {
      throw new BadRequestException("relationshipType is required");
    } else if (registerDTO.relationshipType().isBlank()) {
      throw new BadRequestException("relationshipType must have at least one character");
    }

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

    GenderPreference genderPreference =
        GenderPreference.parse(registerDTO.genderPreference())
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "gender is invalid, valid options include: ["
                            + getGenderPreferenceOptionsToString()
                            + "]"));

    userService
        .parseDateOfBirth(registerDTO.dateOfBirth())
        .filter(date -> userService.isOver18(date))
        .orElseThrow(
            () ->
                new BadRequestException(
                    "date of birth field doesn't include a valid date or is younger then 18"));

    Optional<AgePreference> agePreference =
        Optional.ofNullable(registerDTO.agePreference()).map(AgePreferenceDTO::convert);
    agePreference.ifPresent(
        pref -> {
          if (pref.minAgeUnder18()) {
            throw new BadRequestException("agePreference.minAge is invalid: must be 18+");
          }
          if (pref.maxAgeSmallerThanMinAge()) {
            throw new BadRequestException(
                "agePreference.maxAge is invalid: must be greater or equal to minAge");
          }
        });

    User user =
        userService.save(
            registerDTO.email(),
            registerDTO.alias(),
            registerDTO.password(),
            gender,
            registerDTO.dateOfBirth(),
            registerDTO.bio(),
            profilePictureService.save(registerDTO.profilePicture()),
            genderPreference,
            relationshipType);

    agePreference.ifPresent(
        pref -> {
          user.setAgePreference(pref);
          userService.update(user);
        });

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

  private static String getGenderPreferenceOptionsToString() {
    return String.join(
        ", ", Arrays.stream(GenderPreference.values()).map(GenderPreference::getName).toList());
  }

  private static String getRelationshipTypeOptionsString() {
    return String.join(
        ", ",
        Arrays.stream(UserRelationshipType.values()).map(UserRelationshipType::getName).toList());
  }
}
