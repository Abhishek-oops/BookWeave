package com.example.bookweave.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;

@Service
public class JwtService {

    private final String secret;
    private final long jwtExpiration;

    public JwtService( @Value("${bookweave.jwt.secret}") String secret,
                       @Value("${bookweave.jwt.expiration}") long jwtExpiration )
    {
        this.secret = secret;
        this.jwtExpiration = jwtExpiration;
    }

    public long getJwtExpiration() {
        return jwtExpiration;
    }


    // Secret key object banna
    private SecretKey getSigningKey() {

        byte[] keyBytes = Base64.getDecoder().decode(secret);

        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Jwt token Generation
    public String generateToken(UserDetails userDetails) {

        return Jwts.builder()   // builder design pattern use kiya hai
                .subject(userDetails.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(getSigningKey())
                .compact();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token) // yah verify , expiry , validate krata hai
                .getPayload();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {

        String username = extractUsername(token);

        return username.equals(userDetails.getUsername());
    }

    public boolean isPublicApi(HttpServletRequest request) {

        return (request.getMethod().equals("GET")
                && request.getServletPath().equals("/api/books"))

                ||

                (request.getMethod().equals("POST")
                        && request.getServletPath().equals("/api/bookSubmissions"));
    }

}