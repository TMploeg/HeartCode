package com.itvitae.heartcode.chatmessages;

import com.itvitae.heartcode.user.User;
import com.itvitae.heartcode.user.UserService;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatMessageService {
  private final ChatMessageRepository chatMessageRepository;
  private final UserService userService;

  public List<ChatMessage> getAllForUsers(User user1, User user2) {
    return chatMessageRepository.getAllForUsers(user1, user2);
  }

  public Optional<ChatMessage> getLastMessage(User user1, User user2) {
    return chatMessageRepository.getLastMessage(user1, user2);
  }

  public ChatMessage save(String text, User receiver) {
    LocalDateTime now = LocalDateTime.now();
    User sender = userService.getCurrentUser();

    if (text.isBlank()) {
      throw new IllegalArgumentException("text must not be blank");
    }
    if (sender.equals(receiver.getEmail())) {
      throw new IllegalArgumentException("sender and receiver cannot be the same");
    }

    return chatMessageRepository.save(new ChatMessage(text, sender, receiver, now));
  }
}
