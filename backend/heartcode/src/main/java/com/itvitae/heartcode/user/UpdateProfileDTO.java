package com.itvitae.heartcode.user;

import java.util.Map;

public record UpdateProfileDTO(String alias, String gender, Map<Long, Byte> profilePicture) {}
