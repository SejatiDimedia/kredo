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

    // POST /api/v1/journals/{id}/submit?entityId=1&userId=1
    @PostMapping("/{id}/submit")
    public ResponseEntity<JournalResponse> submitJournal(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "1") Long userId) {
        JournalResponse response = journalService.submitJournal(entityId, id, userId);
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/journals/{id}/approve?entityId=1&approverId=2&post=true
    @PostMapping("/{id}/approve")
    public ResponseEntity<JournalResponse> approveJournal(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "2") Long approverId,
            @RequestParam(defaultValue = "true") boolean post) {
        JournalResponse response = journalService.approveJournal(entityId, id, approverId, post);
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/journals/{id}/reject?entityId=1&rejecterId=2
    @PostMapping("/{id}/reject")
    public ResponseEntity<JournalResponse> rejectJournal(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "2") Long rejecterId,
            @Valid @RequestBody com.kredo.backend.journal.dto.RejectJournalRequest request) {
        JournalResponse response = journalService.rejectJournal(entityId, id, rejecterId, request.reason());
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/journals/{id}/post?entityId=1&posterId=2
    @PostMapping("/{id}/post")
    public ResponseEntity<JournalResponse> postJournal(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "2") Long posterId) {
        JournalResponse response = journalService.postJournal(entityId, id, posterId);
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/journals/{id}/cancel?entityId=1&userId=1
    @PostMapping("/{id}/cancel")
    public ResponseEntity<JournalResponse> cancelJournal(
            @PathVariable Long id,
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "1") Long userId) {
        JournalResponse response = journalService.cancelJournal(entityId, id, userId);
        return ResponseEntity.ok(response);
    }
}