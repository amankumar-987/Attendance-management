package com.example.attendance.controller;

import com.example.attendance.model.Student;
import com.example.attendance.repo.AttendanceRepository;
import com.example.attendance.repo.StudentRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:3000")
public class StudentController {

    private final StudentRepository studentRepo;
    private final AttendanceRepository attendanceRepo;

    public StudentController(StudentRepository studentRepo, AttendanceRepository attendanceRepo) {
        this.studentRepo = studentRepo;
        this.attendanceRepo = attendanceRepo;
    }

    @GetMapping("/attendance/me")
    public Object myAttendance(@RequestParam(required = false) String from,
                               @RequestParam(required = false) String to,
                               Authentication auth) {
        Long userId = Long.valueOf((String) auth.getPrincipal());
        Student s = studentRepo.findByUser_Id(userId)
                .orElseThrow(() -> new RuntimeException("No student profile linked to this user"));

        LocalDate f = (from == null) ? LocalDate.parse("1900-01-01") : LocalDate.parse(from);
        LocalDate t = (to == null) ? LocalDate.parse("2999-12-31") : LocalDate.parse(to);

        return attendanceRepo.findByStudent_IdAndDateBetween(s.getId(), f, t);
    }
}
