package com.itvitae.heartcode.user;
import java.util.Map;

public record RegisterDTO(
    String email,
    String alias,
    String password,
    String gender,
    String dateOfBirth,
    String bio,
    String genderPreference,
    Map<Long, Byte> profilePicture) {}
