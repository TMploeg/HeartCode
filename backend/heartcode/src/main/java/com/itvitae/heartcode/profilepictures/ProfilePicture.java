package com.itvitae.heartcode.profilepictures;

import com.itvitae.heartcode.user.User;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ProfilePicture {
  @Id @OneToOne private User owner;

  @Setter @Lob private byte[] imageData;
}
