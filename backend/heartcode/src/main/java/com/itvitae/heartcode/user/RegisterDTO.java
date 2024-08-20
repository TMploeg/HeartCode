package com.itvitae.heartcode.user;


public record RegisterDTO(
    String email,
    String alias,
    String password,
    String dateOfBirth,
    String gender,
    String relationshipType,
    String bio) {}
