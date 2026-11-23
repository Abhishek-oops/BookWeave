package com.example.bookweave.service;

import com.example.bookweave.dto.*;
import com.example.bookweave.entity.Book;
import com.example.bookweave.entity.BookSubmission;
import com.example.bookweave.entity.SubmissionStatus;
import com.example.bookweave.exceptionHandle.ResourceNotFoundException;
import com.example.bookweave.mapper.BookSubmissionMapper;
import com.example.bookweave.repository.BookSubmissionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BooksubmissionService {
    BookSubmissionRepository bookSubmissionRepository;
    BookSubmissionMapper bookSubmissionMapper ;

    public BooksubmissionService(BookSubmissionRepository bookSubmissionRepository, BookSubmissionMapper bookSubmissionMapper) {
        this.bookSubmissionRepository = bookSubmissionRepository;
        this.bookSubmissionMapper = bookSubmissionMapper;
    }

    public BookSubmissionResponseDto submitBook(BookSubmissionRequestDto bookSubmissionRequestDtoReq){
       BookSubmission bookSubmissionReq = bookSubmissionMapper.bookSubmissionDtoToEntity(bookSubmissionRequestDtoReq);
       bookSubmissionReq.setSubmittedAt(LocalDateTime.now());

       bookSubmissionReq.setStatus(SubmissionStatus.NEW);
       BookSubmission bookSubmissionResponse = bookSubmissionRepository.save(bookSubmissionReq);

        BookSubmissionResponseDto bookSubmissionResponseDto = new BookSubmissionResponseDto()   ;
        bookSubmissionResponseDto.setStatus("SUCCESS");
        bookSubmissionResponseDto.setMessage("Thank you! Your book submission has been received. Our team will contact you soon.") ;
       return bookSubmissionResponseDto;
    }

    // Admin usersdata get kraga
    public List<BookSubmissionAdminResponseDto> getUserDataService()  {
        List<BookSubmissionAdminResponseDto> response  =  new ArrayList<>();
        List<BookSubmission> bookSubmissions = bookSubmissionRepository.findAll();
        for(BookSubmission bookSubmission : bookSubmissions)
        {
            response.add(bookSubmissionMapper.entityTobookSubmissionAdminResponseDto(bookSubmission));
        }

        return response ;
    }

    // status change krna ke liya
    public BookSubmissionAdminResponseDto updateSubmissionStatus(
            Long id,
            StatusUpdateRequestDto request) {

        BookSubmission submission =
                bookSubmissionRepository.findById(id)
                        .orElseThrow(() ->
                                 new ResourceNotFoundException());

        submission.setStatus(request.getStatus());

        BookSubmission updatedSubmission =
                bookSubmissionRepository.save(submission);

        return bookSubmissionMapper
                .entityTobookSubmissionAdminResponseDto(updatedSubmission);
    }


}

