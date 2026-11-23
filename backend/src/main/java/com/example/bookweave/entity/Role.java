package com.example.bookweave.entity;

import jakarta.persistence.*;

@Entity
public class Role {
    @Id
    @GeneratedValue ( strategy = GenerationType.IDENTITY)
        private long id ;

    @Column(nullable = false , unique = true)
    private String role;

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }


}
