package com.kredo.backend.importer.controller;

import com.kredo.backend.auth.security.UserPrincipal;
import com.kredo.backend.importer.dto.ImportJobResponse;
import com.kredo.backend.importer.service.CsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/imports")
@RequiredArgsConstructor
public class ImportController {

    private final CsvImportService csvImportService;

    @PostMapping(value = "/csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportJobResponse> uploadCsv(
            @RequestParam(required = false) Long entityId,
            @RequestParam(required = false) Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "true") boolean autoPost,
            @RequestParam(defaultValue = "false") boolean force,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        Long effectiveUserId = resolveUserId(userId, principal);
        return ResponseEntity.ok(csvImportService.processCsvImport(effectiveEntityId, effectiveUserId, file, autoPost, force));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<ImportJobResponse>> getJobHistory(
            @RequestParam(required = false) Long entityId,
            @RequestParam(defaultValue = "50") int limit,
            @AuthenticationPrincipal UserPrincipal principal) {
        Long effectiveEntityId = resolveEntityId(entityId, principal);
        return ResponseEntity.ok(csvImportService.getImportHistory(effectiveEntityId, limit));
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
