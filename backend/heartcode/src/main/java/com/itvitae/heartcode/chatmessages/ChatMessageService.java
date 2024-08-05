package com.itvitae.heartcode.chatmessages;

import com.itvitae.heartcode.user.User;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
  private final ChatMessageRepository chatMessageRepository;

  public List<ChatMessage> getAllForUsers(User user1, User user2) {
    return chatMessageRepository.getAllForUsers(user1, user2);
  }
}
