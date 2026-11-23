package com.example.bookweave.exceptionHandle;

import com.example.bookweave.dto.GenericExceptionDto;
import com.example.bookweave.dto.ValidatonExecptionDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidatonExecptionDto> handleValidationException(
         MethodArgumentNotValidException ex) {
        ValidatonExecptionDto validatonExecptionDto= new ValidatonExecptionDto();
        HashMap<String ,String> errorfield = new HashMap<>();

        validatonExecptionDto.setStatus(400);
        validatonExecptionDto.setMessage("Validation failed");

        // list of fieldError ko HashMap map dala
         ex.getBindingResult()
                 .getFieldErrors()
                 .forEach(error -> errorfield.put(error.getField() , error.getDefaultMessage()) );

        validatonExecptionDto.setError(errorfield);

         return ResponseEntity
                 .status(HttpStatus.BAD_REQUEST)
                 .body(validatonExecptionDto);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<String> handleMessageNotReadable(
            HttpMessageNotReadableException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body("Request body is missing or invalid");
    }

    @ExceptionHandler(IOException.class)
    public ResponseEntity<GenericExceptionDto> handleIOException(
            IOException e) {
        GenericExceptionDto genericExceptionDto = new GenericExceptionDto();
        genericExceptionDto.setMessage( "Failed to store cover image");
        genericExceptionDto.setStatus(500);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(genericExceptionDto);
    }


   @ExceptionHandler(ResourceNotFoundException.class)
   public ResponseEntity<GenericExceptionDto> resourceNotFoundExecption(ResourceNotFoundException ex){
        GenericExceptionDto genericExceptionDto = new GenericExceptionDto();
        genericExceptionDto.setStatus(ex.getStatus());
        genericExceptionDto.setMessage(ex.getMessage());
        return ResponseEntity.
                status(HttpStatus.NOT_FOUND)
                .body(genericExceptionDto);
   }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<GenericExceptionDto> handleGenericExecption (Exception ex) {
        GenericExceptionDto genericExceptionDto = new GenericExceptionDto();
        genericExceptionDto.setStatus(500);
        genericExceptionDto.setMessage("Something went Wrong");
        System.out.println(ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(genericExceptionDto) ;
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, Object>> handleBadCredentials(
            BadCredentialsException ex) {

        Map<String, Object> response = new HashMap<>();

        response.put("status", 401);
        response.put("error", "Unauthorized");
        response.put("message", "Wrong username or password");

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }
}
