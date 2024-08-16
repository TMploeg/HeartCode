package com.itvitae.heartcode.profilepictures;

import com.itvitae.heartcode.user.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfilePictureRepository extends JpaRepository<ProfilePicture, User> {}
