package com.itvitae.heartcode.chatmessages;

import com.itvitae.heartcode.user.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@Getter
public class ChatMessage {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Lob private String text;

  @ManyToOne private User sender;

  @ManyToOne private User receiver;

  private LocalDateTime dateTime;

  public ChatMessage(String text, User sender, User receiver, LocalDateTime dateTime) {
    this.text = text;
    this.sender = sender;
    this.receiver = receiver;
    this.dateTime = dateTime;
  }
}
