package com.itvitae.heartcode.profilepictures;

import jakarta.persistence.*;
import java.util.UUID;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
public class ProfilePicture {
  @Id
  @GeneratedValue(strategy = GenerationType.UUID)
  private UUID id;

  @Setter @Lob private byte[] imageData;

  public ProfilePicture(byte[] imageData) {
    this.imageData = imageData;
  }
}
