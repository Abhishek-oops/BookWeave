
package com.example.bookweave.config;

import com.example.bookweave.entity.Role;
import com.example.bookweave.entity.User;
import com.example.bookweave.repository.RoleRepository;
import com.example.bookweave.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class AdminInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${bookweave.admin.username}")
    private String adminUsername;

    @Value("${bookweave.admin.password}")
    private String adminPassword;

    public AdminInitializer(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        // 1. Validate credentials
        if (adminUsername == null || adminUsername.isBlank()
                || adminPassword == null || adminPassword.isBlank()) {

            throw new IllegalStateException(
                    "Admin username and password must be configured"
            );
        }

        // 2. Check whether admin already exists
        if (userRepository.existsByUsername(adminUsername)) {
            System.out.println("Initial admin already exists");
            return;
        }

        // 3. Find or create ROLE_ADMIN
        Role adminRole = roleRepository.findByRole("ROLE_ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setRole("ROLE_ADMIN");
                    return roleRepository.save(role);
                });

        // 4. Create initial admin
        User admin = new User();

        admin.setUsername(adminUsername);
        admin.setPassword(passwordEncoder.encode(adminPassword));
        admin.setRoles(Set.of(adminRole));

        // 5. Save admin
        userRepository.save(admin);

        System.out.println("Initial admin created successfully");
    }
}
