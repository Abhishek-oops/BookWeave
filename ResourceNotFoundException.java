package com.example.bookweave.exceptionHandle;

public class ResourceNotFoundException extends RuntimeException{
    private int status = 404;

    private String message = "Resource not found" ;

    public String getMessage() {
        return message;
    }

    public int getStatus() {
        return status;
    }


}
