package com.itvitae.heartcode.profilepictures;

import java.util.Collection;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProfilePictureService {
  private final ProfilePictureRepository profilePictureRepository;

  public ProfilePicture save(Map<Long, Byte> pictureData) {
    if (pictureData == null || pictureData.isEmpty()) {
      throw new IllegalArgumentException("pictureData is missing");
    }

    return profilePictureRepository.save(new ProfilePicture(toByteArray(pictureData)));
  }

  public ProfilePicture update(ProfilePicture profilePicture, Map<Long, Byte> pictureData) {
    if (pictureData == null || pictureData.isEmpty()) {
      throw new IllegalArgumentException("pictureData is required");
    }

    profilePicture.setImageData(toByteArray(pictureData));
    return profilePictureRepository.save(profilePicture);
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
