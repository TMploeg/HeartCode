package com.itvitae.heartcode.user;
import java.sql.Clob;

public record RegisterDTO(String email, String alias, String password, String gender, String dateOfBirth, String bio) {}


