package com.example.bookweave.repository;

import com.example.bookweave.entity.BookSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookSubmissionRepository  extends JpaRepository<BookSubmission, Long> {

}
