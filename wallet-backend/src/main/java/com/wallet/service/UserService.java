package com.wallet.service;

import com.wallet.dto.UserDto;
import com.wallet.exception.ApiException;
import com.wallet.model.User;
import com.wallet.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public UserDto getCurrentUser(String email) {
        log.debug("Fetching user profile for email: {}", email);
        
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found", 404));

        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getBalance()
        );
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ApiException("User not found", 404));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("User not found with email: " + email, 404));
    }
}
