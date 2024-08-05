package com.itvitae.heartcode.user;

import com.itvitae.heartcode.exceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/users")
@CrossOrigin("${app.cors-allowed-origins}")
public class UserController {
  private final UserService userService;

  @PostMapping("register")
  public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
    if (registerDTO.email() == null) {
      throw new BadRequestException("email is required");
    } else if (userService.isInvalidEmail(registerDTO.email())
        || userService.userWithEmailExists(registerDTO.email())) {
      throw new BadRequestException("email is invalid");
    }
    if (registerDTO.alias() == null || registerDTO.alias().isBlank()) {
      throw new BadRequestException("alias is required");
    }

    User user = userService.save(new User(registerDTO.email(), registerDTO.alias()));

    return ResponseEntity.ok(UserDTO.from(user));
  }
}
