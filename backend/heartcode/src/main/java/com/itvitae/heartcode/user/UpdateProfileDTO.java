package com.itvitae.heartcode.user;

import java.util.Map;

public record UpdateProfileDTO(
    String alias,
    String gender,
    String bio,
    Map<Long, Byte> profilePicture,
    String genderPreference,
    String relationshipType,
    AgePreferenceDTO agePreference) {}
