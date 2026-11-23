package com.example.bookweave.service;

import com.example.bookweave.dto.BookRequestDto;
import com.example.bookweave.dto.BookResponseDto;
import com.example.bookweave.entity.Book;
import com.example.bookweave.exceptionHandle.ResourceNotFoundException;
import com.example.bookweave.mapper.BookMapper;
import com.example.bookweave.repository.BookRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BookService {

    private final BookRepository bookRepository;
    private final BookMapper bookMapper;
    private final FileStorageService fileStorageService ;


    public BookService(BookRepository bookRepository , BookMapper bookMapper , FileStorageService fileStorageService) {
        this.bookRepository = bookRepository;
        this.bookMapper = bookMapper ;
        this.fileStorageService = fileStorageService;
    }



    public BookResponseDto publishedBook(BookRequestDto bookRequestDto , MultipartFile coverImage) throws IOException {

       Book bookRequest = bookMapper.requestDtoToEntity(bookRequestDto);
        String coverImgURl = fileStorageService.storeBookCover(coverImage);
        bookRequest.setCoverImageUrl(coverImgURl);
        bookRequest.setUploadedAt(LocalDateTime.now());
        bookRequest.setPublished(true);

        Book bookResponse = bookRepository.save(bookRequest);
        return  bookMapper.entityToResponseDto(bookResponse);
    }


    public List<BookResponseDto> getPublishedBooks() {

        List<Book> publishedBooks = bookRepository.findByPublishedTrue();

        List<BookResponseDto> response = new ArrayList<>();

        for (Book publishBook : publishedBooks) {
            response.add(bookMapper.entityToResponseDto(publishBook));
        } 

        return response;
    }



    public List<BookResponseDto> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        List<BookResponseDto> response = new ArrayList<>();

        for (Book book : books) {
            response.add(bookMapper.entityToResponseDto(book));
        }

        return response;
    }

    // upload book update krna ke liya
    public BookResponseDto updateBook(
            Long id,
            BookRequestDto bookRequestDto,
            MultipartFile coverImage) throws IOException {

        Book existingBook = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException());

        existingBook.setTitle(bookRequestDto.getTitle());
        existingBook.setAuthor(bookRequestDto.getAuthor());
        existingBook.setCategory(bookRequestDto.getCategory());
        existingBook.setDescription(bookRequestDto.getDescription());
        existingBook.setPublishedAt(bookRequestDto.getPublishedAt());

        if (coverImage != null && !coverImage.isEmpty()) {

            String coverImageUrl =
                    fileStorageService.storeBookCover(coverImage);

            existingBook.setCoverImageUrl(coverImageUrl);
        }

        Book updatedBook = bookRepository.save(existingBook);

        return bookMapper.entityToResponseDto(updatedBook);
    }



    public BookResponseDto updatePublishedStatus(
            Long id,
            boolean published) {

        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new
                        ResourceNotFoundException());

        book.setPublished(published);

        Book updatedBook = bookRepository.save(book);

        return bookMapper.entityToResponseDto(updatedBook);
    }
}
