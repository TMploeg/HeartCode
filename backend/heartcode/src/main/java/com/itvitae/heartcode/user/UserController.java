package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.exceptions.NotFoundException;
import com.itvitae.heartcode.profilepictures.ProfilePictureService;
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
    updateGenderPreference(updateProfileDTO.genderPreference(), user).ifPresent(errors::add);
    updateProfilePicture(updateProfileDTO.profilePicture(), user).ifPresent(errors::add);
    updateRelationshipType(updateProfileDTO.relationshipType(), user).ifPresent(errors::add);

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

  private Optional<String> updateGenderPreference(String newGenderPreference, User user) {
    if (newGenderPreference == null) {
      return Optional.empty();
    }

    if (newGenderPreference.isBlank()) {
      return Optional.of("gender preference must have at least one character");
    }

    Optional<GenderPreference> gender = GenderPreference.parse(newGenderPreference);
    gender.ifPresent(user::setGenderPreference);

    return gender.isPresent()
        ? Optional.empty()
        : Optional.of(
            "gender is invalid, valid options: [" + getGenderPreferenceOptionsToString() + "]");
  }

  private Optional<String> updateRelationshipType(String newRelationshipType, User user) {
    if (newRelationshipType == null) {
      return Optional.empty();
    }

    if (newRelationshipType.isBlank()) {
      return Optional.of("relationship type must be filled in");
    }

    Optional<UserRelationshipType> relationshipType =
        UserRelationshipType.parse(newRelationshipType);
    relationshipType.ifPresent(user::setRelationshipType);

    return relationshipType.isPresent()
        ? Optional.empty()
        : Optional.of(
            "relationship type is invalid, valid options: ["
                + getRelationshipTypeOptionsToString()
                + "]");
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

  private static String getGenderPreferenceOptionsToString() {
    return String.join(
        ", ", Arrays.stream(GenderPreference.values()).map(GenderPreference::getName).toList());
  }

  private static String getRelationshipTypeOptionsToString() {
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

  @GetMapping("profilepictures/{id}")
  public byte[] getProfilePicture(@PathVariable UUID id) {
    return profilePictureService.findById(id).orElseThrow(NotFoundException::new).getImageData();
  }

  @GetMapping("get-random-user")
  public ResponseEntity<UserDTO> getRandomUser() {
    return userService
        .findRandomUser()
        .map(UserDTO::from)
        .map(ResponseEntity::ok)
        .orElseGet(() -> ResponseEntity.noContent().build());
  }
}
