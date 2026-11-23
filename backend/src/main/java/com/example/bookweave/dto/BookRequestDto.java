package com.example.bookweave.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public class BookRequestDto {

    @NotBlank(message = "Book title is required")
    @Size(max = 200, message = "Book title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Author name is required")
    @Size(max = 100, message = "Author name cannot exceed 100 characters")
    private String author;

    @NotBlank(message = "Book category is required")
    @Size(max = 100, message = "Book category cannot exceed 100 characters")
    private String category;

    @NotBlank(message = "Book description is required")
    @Size(max = 5000, message = "Book description cannot exceed 5000 characters")
    private String description;

    private LocalDate publishedAt;


    // getter-setter
    public LocalDate getPublishedAt() {
        return publishedAt;
    }

    public void setPublishedAt(LocalDate publishedAt) {
        this.publishedAt = publishedAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

}