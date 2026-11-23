package com.example.bookweave.mapper;
import com.example.bookweave.dto.BookRequestDto;
import com.example.bookweave.dto.BookResponseDto;
import com.example.bookweave.entity.Book;
import org.springframework.stereotype.Component;

@Component
public class BookMapper {

    public Book requestDtoToEntity(BookRequestDto request) {

        Book book = new Book();

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        book.setCategory(request.getCategory());
        book.setDescription(request.getDescription());
        book.setPublishedAt(request.getPublishedAt());

        return book;
    }

    public BookResponseDto entityToResponseDto(Book book) {

        BookResponseDto response = new BookResponseDto();

        response.setId(book.getId());
        response.setTitle(book.getTitle());
        response.setAuthor(book.getAuthor());
        response.setCategory(book.getCategory());
        response.setDescription(book.getDescription());
        response.setCoverImageUrl(book.getCoverImageUrl());
        response.setPublishedAt(book.getPublishedAt());
        response.setPublished(book.isPublished());
        response.setUploadedAt(book.getUploadedAt() == null ? null : book.getUploadedAt().toLocalDate());

        return response;
    }
}