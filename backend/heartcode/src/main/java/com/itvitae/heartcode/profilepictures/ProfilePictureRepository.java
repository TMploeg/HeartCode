package com.itvitae.heartcode.profilepictures;

import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilePictureRepository extends JpaRepository<ProfilePicture, UUID> {}
