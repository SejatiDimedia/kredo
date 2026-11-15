package com.kredo.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

/**
 * Controller sederhana untuk health check API.
 * Anotasi @RestController menandakan class ini menerima HTTP Request dan
 * mengembalikan JSON.
 */
@RestController
@RequestMapping("/api")
public class HealthController {

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "app", "Kredo Accounting Backend",
                "status", "UP",
                "timestamp", Instant.now().toString(),
                "version", "1.0.0-SNAPSHOT"));
    }
}