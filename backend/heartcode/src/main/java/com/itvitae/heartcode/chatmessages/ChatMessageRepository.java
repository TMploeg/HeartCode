package com.itvitae.heartcode.chatmessages;

import com.itvitae.heartcode.user.User;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
  @Query(
      "SELECT m FROM ChatMessage m WHERE (m.sender = ?1 AND m.receiver = ?2) OR (m.sender = ?2 AND m.receiver = ?1) ORDER BY m.dateTime DESC")
  List<ChatMessage> getAllForUsers(User user1, User user2);

  @Query(
      "SELECT m FROM ChatMessage m WHERE (m.sender = ?1 AND m.receiver = ?2) OR (m.sender = ?2 AND m.receiver = ?1) ORDER BY m.dateTime DESC LIMIT 1")
  Optional<ChatMessage> getLastMessage(User user1, User user2);
}
