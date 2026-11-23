package com.example.bookweave.dto;

import com.example.bookweave.entity.SubmissionStatus;

public class StatusUpdateRequestDto {


    private SubmissionStatus status;

    public SubmissionStatus getStatus() {
        return status;
    }

    public void setStatus(SubmissionStatus status) {
        this.status = status;
    }
}
