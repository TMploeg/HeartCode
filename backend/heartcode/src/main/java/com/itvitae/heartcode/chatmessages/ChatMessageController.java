package com.itvitae.heartcode.chatmessages;

import com.itvitae.heartcode.exceptions.BadRequestException;
import com.itvitae.heartcode.match.MatchService;
import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/chat")
@CrossOrigin("${app.cors-allowed-origins}")
@Transactional
public class ChatMessageController {
  private final ChatMessageService chatMessageService;
  private final UserService userService;
  private final MatchService matchService;

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

  @GetMapping("/lastmessage")
  public ChatMessageDTO getLastMessage(@RequestParam String matchEmail) {
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

    ChatMessage lastMessage = chatMessageService.getLastMessage(currentUser, targetUser);

    if (lastMessage == null) {
      throw new BadRequestException("No message to show");
    }

    return new ChatMessageDTO(
        lastMessage.getText(),
        lastMessage.getSender().getEmail().equals(currentUser.getEmail()),
        lastMessage.getDateTime());
  }

  private List<ChatMessageDTO> convertToDTO(List<ChatMessage> messages, User currentUser) {
    return messages.stream()
        .map(
            m ->
                new ChatMessageDTO(
                    m.getText(),
                    m.getSender().getEmail().equals(currentUser.getEmail()),
                    m.getDateTime()))
        .toList();
  }

  @PostMapping
  public ResponseEntity<?> sendMessage(@RequestBody NewMessageDTO newMessageDTO) {
    if (newMessageDTO.text().isBlank()) {
      throw new BadRequestException("message must have at least one character");
    }
    if (newMessageDTO.receiverEmail().equals(userService.getCurrentUser().getEmail())) {
      throw new BadRequestException("cannot send message to self");
    }

    User receiver =
        userService
            .findById(newMessageDTO.receiverEmail())
            .filter(
                rec ->
                    matchService.getMatchedUsers().stream()
                        .anyMatch(u -> u.getEmail().equals(rec.getEmail())))
            .orElseThrow(
                () ->
                    new BadRequestException(
                        "cannot send messages to users you are not matched with"));

    chatMessageService.save(newMessageDTO.text(), receiver);

    return ResponseEntity.ok().build();
  }
}
