package com.example.bookweave.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileStorageService {

    private final Cloudinary cloudinary;

    public FileStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String storeBookCover(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cover image is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        try {
            Map<?, ?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "bookweave/covers",
                            "resource_type", "image"
                    )
            );

            Object secureUrl = result.get("secure_url");
            if (secureUrl == null) {
                throw new IOException("Cloudinary did not return an image URL");
            }
            return secureUrl.toString();
        } catch (IOException exception) {
            throw exception;
        } catch (Exception exception) {
            throw new IOException("Failed to upload cover image to Cloudinary", exception);
        }
    }
}
