package com.example.attendance.repo;

import com.example.attendance.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    Optional<Attendance> findByStudent_IdAndClassRoom_IdAndDate(Long studentId, Long classRoomId, LocalDate date);
    List<Attendance> findByStudent_IdAndDateBetween(Long studentId, LocalDate from, LocalDate to);
    List<Attendance> findByClassRoom_IdAndDate(Long classRoomId, LocalDate date);
}
