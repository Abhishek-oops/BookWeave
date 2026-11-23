package com.example.bookweave.controller;

import com.example.bookweave.dto.BookSubmissionAdminResponseDto;
import com.example.bookweave.dto.BookSubmissionRequestDto;
import com.example.bookweave.dto.BookSubmissionResponseDto;
import com.example.bookweave.dto.StatusUpdateRequestDto;
import com.example.bookweave.service.BooksubmissionService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class BookSubmissionController {

    BooksubmissionService booksubmissionService;
    public BookSubmissionController(BooksubmissionService booksubmissionService) {
        this.booksubmissionService = booksubmissionService;
    }

    @PostMapping("/bookSubmissions")
    public ResponseEntity<BookSubmissionResponseDto> createBookSubmission  (@RequestBody @Valid BookSubmissionRequestDto bookSubmissionRequestDtoReq){
        BookSubmissionResponseDto bookSubmissionDtoResp = booksubmissionService.submitBook(bookSubmissionRequestDtoReq);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(bookSubmissionDtoResp);
    }

    @GetMapping("/admin/bookSubmissions")
    public ResponseEntity<List<BookSubmissionAdminResponseDto>> getUserData(){
        List<BookSubmissionAdminResponseDto> usersDataResponse = booksubmissionService.getUserDataService();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(usersDataResponse);
    }

    @PatchMapping("/admin/bookSubmission/{id}/status")
    public ResponseEntity<BookSubmissionAdminResponseDto> updateSubmissionStatus(
            @PathVariable Long id,
            @Valid @RequestBody StatusUpdateRequestDto request) {

        BookSubmissionAdminResponseDto response =
                booksubmissionService.updateSubmissionStatus(id, request);

        return ResponseEntity
                .status(HttpStatus.OK)
                .body(response);
    }

}
