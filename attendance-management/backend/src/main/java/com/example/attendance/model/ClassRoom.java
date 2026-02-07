package com.example.attendance.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "class_rooms")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class ClassRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String section;
}
