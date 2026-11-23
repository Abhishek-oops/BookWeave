package com.example.bookweave.controller;

import com.example.bookweave.dto.BookResponseDto;
import com.example.bookweave.service.BookService;

import org.springframework.http.HttpStatus;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
public class PublicBookController {
    BookService bookService ;

    public PublicBookController(BookService bookService){
        this.bookService = bookService;
    }


    @GetMapping
    public ResponseEntity<List<BookResponseDto>> getPublishedBooks (){
        List<BookResponseDto> publishedBooks = bookService.getPublishedBooks();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(publishedBooks) ;
    }




}
