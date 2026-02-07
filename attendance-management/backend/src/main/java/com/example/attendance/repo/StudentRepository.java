package com.example.attendance.repo;

import com.example.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNo(String rollNo);
    List<Student> findByClassRoom_Id(Long classRoomId);
    Optional<Student> findByUser_Id(Long userId);
}
