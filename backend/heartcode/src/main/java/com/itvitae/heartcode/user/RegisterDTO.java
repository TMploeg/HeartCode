package com.itvitae.heartcode.user;
import java.sql.Clob;

import java.util.Map;

public record RegisterDTO(
    String email,
    String alias,
    String password,
    String gender,
    String dateOfBirth,
    String bio,
    Map<Long, Byte> profilePicture,
    String relationshipType) {}
