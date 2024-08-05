package com.itvitae.heartcode.match;

import com.itvitae.heartcode.user.UserService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/v1/matches")
@RequiredArgsConstructor
@CrossOrigin("${app.cors-allowed-origins}")
public class MatchController {
  private final MatchService matchService;
  private final UserService userService;

  @GetMapping
  public List<MatchDTO> getAll() {
    return matchService.getAll().stream()
        .map(m -> MatchDTO.from(m, userService.getCurrentUser()).orElse(null))
        .toList();
  }
}
