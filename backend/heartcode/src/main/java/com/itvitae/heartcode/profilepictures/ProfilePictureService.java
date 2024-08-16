package com.itvitae.heartcode.profilepictures;

import com.itvitae.heartcode.user.User;
import java.util.Collection;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfilePictureService {
  private final ProfilePictureRepository profilePictureRepository;

  public ProfilePicture save(User owner, Map<Long, Byte> pictureData) {
    if (pictureData == null || pictureData.isEmpty()) {
      throw new IllegalArgumentException("pictureData is missing");
    }

    return profilePictureRepository.save(new ProfilePicture(owner, toByteArray(pictureData)));
  }

  private byte[] toByteArray(Map<Long, Byte> pictureData) {
    Collection<Byte> bytes = pictureData.values();
    byte[] convertedBytes = new byte[bytes.size()];

    int index = 0;
    for (Byte b : bytes) {
      convertedBytes[index] = b;
      index++;
    }

    return convertedBytes;
  }
}
