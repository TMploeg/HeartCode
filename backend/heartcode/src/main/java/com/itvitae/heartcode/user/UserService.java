package com.itvitae.heartcode.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    public Optional<User> findById(String address){
        return userRepository.findById(address);
    }

    // temporary method, remove after implementing login
    public User getTestUser() {
        return userRepository.findAll().stream()
                .filter(u -> u.getAlias().equals(User.TEST_USER_NAME))
                .findFirst()
                .get();
    }
}
