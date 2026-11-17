package com.kredo.backend.importer.controller;

import com.kredo.backend.importer.dto.ImportJobResponse;
import com.kredo.backend.importer.service.CsvImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/imports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ImportController {

    private final CsvImportService csvImportService;

    @PostMapping(value = "/csv", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImportJobResponse> uploadCsv(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "1") Long userId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "true") boolean autoPost,
            @RequestParam(defaultValue = "false") boolean force) {
        return ResponseEntity.ok(csvImportService.processCsvImport(entityId, userId, file, autoPost, force));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<ImportJobResponse>> getJobHistory(
            @RequestParam(defaultValue = "1") Long entityId,
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(csvImportService.getImportHistory(entityId, limit));
    }
}