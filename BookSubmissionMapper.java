package com.example.bookweave.mapper;

import com.example.bookweave.dto.BookSubmissionAdminResponseDto;
import com.example.bookweave.dto.BookSubmissionRequestDto;
import com.example.bookweave.entity.BookSubmission;
import org.springframework.stereotype.Component;

@Component
public class BookSubmissionMapper {
   public BookSubmission bookSubmissionDtoToEntity(BookSubmissionRequestDto bookSubmissionRequestDto){
        BookSubmission bookSubmission = new BookSubmission();
        bookSubmission.setAuthorName(bookSubmissionRequestDto.getAuthorName());
        bookSubmission.setBookCategory(bookSubmissionRequestDto.getBookCategory());
        bookSubmission.setEmail(bookSubmissionRequestDto.getEmail());
        bookSubmission.setBookTitle(bookSubmissionRequestDto.getBookTitle());
        bookSubmission.setPhone(bookSubmissionRequestDto.getPhone());
        bookSubmission.setMessage(bookSubmissionRequestDto.getMessage());
        bookSubmission.setBookDescription(bookSubmissionRequestDto.getBookDescription());
//        bookSubmission.setStatus("New");
//
//        bookSubmission.setUploadedAt(LocalDateTime.now());
        return bookSubmission;
    }

   public BookSubmissionRequestDto bookSubmissionEntityToDto(BookSubmission bookSubmission){
        BookSubmissionRequestDto bookSubmissionRequestDto = new BookSubmissionRequestDto();
        bookSubmissionRequestDto.setAuthorName(bookSubmission.getAuthorName());
        bookSubmissionRequestDto.setBookCategory(bookSubmission.getBookCategory());
        bookSubmissionRequestDto.setEmail(bookSubmission.getEmail());
        bookSubmissionRequestDto.setBookTitle(bookSubmission.getBookTitle());
        bookSubmissionRequestDto.setPhone(bookSubmission.getPhone());
        bookSubmissionRequestDto.setMessage(bookSubmission.getMessage());
        bookSubmissionRequestDto.setBookDescription(bookSubmission.getBookDescription());
        return bookSubmissionRequestDto;
    }

    public BookSubmissionAdminResponseDto entityTobookSubmissionAdminResponseDto (BookSubmission bookSubmission) {

         BookSubmissionAdminResponseDto response =
                 new BookSubmissionAdminResponseDto();

         response.setId(bookSubmission.getId());
         response.setAuthorName(bookSubmission.getAuthorName());
         response.setEmail(bookSubmission.getEmail());
         response.setPhone(bookSubmission.getPhone());
         response.setBookTitle(bookSubmission.getBookTitle());
         response.setBookCategory(bookSubmission.getBookCategory());
         response.setBookDescription(bookSubmission.getBookDescription());
         response.setMessage(bookSubmission.getMessage());
         response.setStatus(bookSubmission.getStatus());
         response.setSubmittedAt(bookSubmission.getSubmittedAt());

    return response;
    }

}
