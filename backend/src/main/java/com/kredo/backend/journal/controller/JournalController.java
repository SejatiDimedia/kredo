package com.kredo.backend.journal.controller;

import com.kredo.backend.auth.security.UserPrincipal;
import com.kredo.backend.journal.dto.CreateJournalRequest;
import com.kredo.backend.journal.dto.JournalResponse;
import com.kredo.backend.journal.dto.RejectJournalRequest;
import com.kredo.backend.journal.dto.ReverseJournalRequest;
import com.kredo.backend.journal.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/journals")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;

    // GET /api/v1/journals?entityId=1
    @GetMapping
    public ResponseEntity<List<JournalResponse>> getJournals(
            @RequestParam(required = false) Long entityId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        List<JournalResponse> journals = journalService.getJournalsByEntity(effectiveEntityId);
        return ResponseEntity.ok(journals);
    }

    // POST /api/v1/journals?entityId=1&post=true
    @PostMapping
    public ResponseEntity<JournalResponse> createJournal(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "true") boolean post,
            @Valid @RequestBody CreateJournalRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveUserId = resolveUserId(null, principal);
        JournalResponse response = journalService.createJournal(effectiveEntityId, effectiveUserId, request, post);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // GET /api/v1/journals/{id}?entityId=1
    @GetMapping("/{id}")
    public ResponseEntity<JournalResponse> getJournalById(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        JournalResponse journal = journalService.getJournalById(effectiveEntityId, id);
        return ResponseEntity.ok(journal);
    }

    // POST /api/v1/journals/{id}/reverse?entityId=1
    @PostMapping("/{id}/reverse")
    public ResponseEntity<JournalResponse> reverseJournal(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @RequestBody(required = false) ReverseJournalRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        String reason = request != null ? request.reason() : "Koreksi pembukuan";
        JournalResponse response = journalService.reverseJournal(effectiveEntityId, id, reason);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // POST /api/v1/journals/{id}/submit?entityId=1&userId=1
    @PostMapping("/{id}/submit")
    public ResponseEntity<JournalResponse> submitJournal(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long userId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveUserId = resolveUserId(userId, principal);
        JournalResponse response = journalService.submitJournal(effectiveEntityId, id, effectiveUserId);
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/journals/{id}/approve?entityId=1&approverId=2&post=true
    @PostMapping("/{id}/approve")
    public ResponseEntity<JournalResponse> approveJournal(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long approverId,
            @RequestParam(defaultValue = "true") boolean post,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveApproverId = resolveUserId(approverId, principal);
        JournalResponse response = journalService.approveJournal(effectiveEntityId, id, effectiveApproverId, post);
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/journals/{id}/reject?entityId=1&rejecterId=2
    @PostMapping("/{id}/reject")
    public ResponseEntity<JournalResponse> rejectJournal(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long rejecterId,
            @Valid @RequestBody RejectJournalRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveRejecterId = resolveUserId(rejecterId, principal);
        JournalResponse response = journalService.rejectJournal(effectiveEntityId, id, effectiveRejecterId, request.reason());
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/journals/{id}/post?entityId=1&posterId=2
    @PostMapping("/{id}/post")
    public ResponseEntity<JournalResponse> postJournal(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long posterId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectivePosterId = resolveUserId(posterId, principal);
        JournalResponse response = journalService.postJournal(effectiveEntityId, id, effectivePosterId);
        return ResponseEntity.ok(response);
    }

    // POST /api/v1/journals/{id}/cancel?entityId=1&userId=1
    @PostMapping("/{id}/cancel")
    public ResponseEntity<JournalResponse> cancelJournal(
            @PathVariable Long id,
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long userId,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveUserId = resolveUserId(userId, principal);
        JournalResponse response = journalService.cancelJournal(effectiveEntityId, id, effectiveUserId);
        return ResponseEntity.ok(response);
    }

    private Long resolveEntityId(Long entityIdParam, UserPrincipal principal) {
        if (principal != null && principal.getEntityId() != null) {
            return principal.getEntityId();
        }
        return entityIdParam != null ? entityIdParam : 1L;
    }

    private Long resolveUserId(Long userIdParam, UserPrincipal principal) {
        if (principal != null && principal.getUserId() != null) {
            return principal.getUserId();
        }
        return userIdParam != null ? userIdParam : 1L;
    }
}
