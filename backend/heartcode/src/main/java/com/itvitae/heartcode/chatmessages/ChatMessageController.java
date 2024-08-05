package com.itvitae.heartcode.chatmessages;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import jakarta.transaction.Transactional;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/chat")
@CrossOrigin("${app.cors-allowed-origins}")
@Transactional
public class ChatMessageController {
  private final ChatMessageService chatMessageService;
  private final UserService userService;

  @GetMapping
  public List<ChatMessageDTO> getForUser(@RequestParam String matchEmail) {
    if (userService.isInvalidEmail(matchEmail)) {
      throw new BadRequestException("param 'matchEmail' is not a valid email address");
    }

    User currentUser = userService.getCurrentUser();

    if (currentUser.getEmail().equals(matchEmail)) {
      throw new BadRequestException("cannot get chat messages for self");
    }

    User targetUser =
        userService
            .findById(matchEmail)
            .orElseThrow(() -> new BadRequestException("user '" + matchEmail + "' not found"));

    return convertToDTO(chatMessageService.getAllForUsers(currentUser, targetUser), currentUser);
  }

  private List<ChatMessageDTO> convertToDTO(List<ChatMessage> messages, User currentUser) {
    return messages.stream()
        .map(
            m ->
                new ChatMessageDTO(
                    m.getText(), m.getSender().getEmail().equals(currentUser.getEmail())))
        .toList();
  }
}
