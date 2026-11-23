package com.example.bookweave.controller;

import com.example.bookweave.dto.BookRequestDto;
import com.example.bookweave.dto.BookResponseDto;
import com.example.bookweave.service.BookService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/book")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<BookResponseDto>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BookResponseDto> publishedBook(
            @RequestPart("book") @Valid BookRequestDto bookRequestDto,
            @RequestPart("coverImage") MultipartFile coverImage
    ) throws IOException {

        BookResponseDto response =
                bookService.publishedBook(bookRequestDto, coverImage);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<BookResponseDto> updateBook(
            @PathVariable Long id,
            @RequestPart("book") @Valid BookRequestDto bookRequestDto,
            @RequestPart(value = "coverImage", required = false)
            MultipartFile coverImage
    ) throws IOException {

        BookResponseDto response =
                bookService.updateBook(id, bookRequestDto, coverImage);

        return ResponseEntity.ok(response);
    }

    @PatchMapping("/{id}/published")
    public ResponseEntity<BookResponseDto> updatePublishedStatus(
            @PathVariable Long id,
            @RequestParam boolean published
    ) {

        BookResponseDto response =
                bookService.updatePublishedStatus(id, published);

        return ResponseEntity.ok(response);
    }
}
