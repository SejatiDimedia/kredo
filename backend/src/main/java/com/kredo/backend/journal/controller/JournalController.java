package com.kredo.backend.journal.controller;

import com.kredo.backend.journal.dto.CreateJournalRequest;
import com.kredo.backend.journal.dto.JournalResponse;
import com.kredo.backend.journal.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/journals")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class JournalController {

    private final JournalService journalService;

    // GET /api/v1/journals?entityId=1
    @GetMapping
    public ResponseEntity<List<JournalResponse>> getJournals(
            @RequestParam(defaultValue = "1") Long entityId) {
        List<JournalResponse> journals = journalService.getJournalsByEntity(entityId);
        return ResponseEntity.ok(journals);
    }

    // POST /api/v1/journals?entityId=1&post=true
    @PostMapping
    public ResponseEntity<JournalResponse> createJournal(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "true") boolean post,
            @Valid @RequestBody CreateJournalRequest request) {
        JournalResponse response = journalService.createJournal(entityId, request, post);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/v1/journals/{id}?entityId=1
    @GetMapping("/{id}")
    public ResponseEntity<JournalResponse> getJournalById(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId) {
        JournalResponse journal = journalService.getJournalById(entityId, id);
        return ResponseEntity.ok(journal);
    }

    // POST /api/v1/journals/{id}/reverse?entityId=1
    @PostMapping("/{id}/reverse")
    public ResponseEntity<JournalResponse> reverseJournal(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestBody(required = false) com.kredo.backend.journal.dto.ReverseJournalRequest request) {
        String reason = request != null ? request.reason() : "Koreksi pembukuan";
        JournalResponse response = journalService.reverseJournal(entityId, id, reason);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}