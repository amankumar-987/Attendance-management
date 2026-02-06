package com.example.attendance.controller;

import com.example.attendance.dto.BootstrapRequest;
import com.example.attendance.model.Role;
import com.example.attendance.model.User;
import com.example.attendance.repo.UserRepository;
import com.example.attendance.security.JwtUtil;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bootstrap")
@CrossOrigin(origins = "http://localhost:3000")
public class BootstrapController {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwt;

    public BootstrapController(UserRepository userRepo, PasswordEncoder encoder, JwtUtil jwt) {
        this.userRepo = userRepo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @PostMapping
    public Map<String, Object> bootstrap(@RequestBody BootstrapRequest req) {
        if (userRepo.existsByRole(Role.ADMIN)) {
            throw new RuntimeException("Admin already exists");
        }

        if (req.getName() == null || req.getEmail() == null || req.getPassword() == null) {
            throw new RuntimeException("name, email, password required");
        }

        User admin = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(encoder.encode(req.getPassword()))
                .role(Role.ADMIN)
                .build();

        admin = userRepo.save(admin);
        String token = jwt.generateToken(admin.getId(), admin.getRole().name(), admin.getEmail());

        return Map.of(
                "token", token,
                "user", Map.of(
                        "id", admin.getId(),
                        "name", admin.getName(),
                        "email", admin.getEmail(),
                        "role", admin.getRole().name()
                )
        );
    }
}
