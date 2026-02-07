package com.example.attendance.controller;

import com.example.attendance.dto.MarkAttendanceRequest;
import com.example.attendance.model.*;
import com.example.attendance.repo.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/teacher")
@CrossOrigin(origins = "http://localhost:3000")
public class TeacherController {

    private final AttendanceRepository attendanceRepo;
    private final StudentRepository studentRepo;
    private final ClassRoomRepository classRepo;
    private final UserRepository userRepo;

    public TeacherController(AttendanceRepository attendanceRepo,
                             StudentRepository studentRepo,
                             ClassRoomRepository classRepo,
                             UserRepository userRepo) {
        this.attendanceRepo = attendanceRepo;
        this.studentRepo = studentRepo;
        this.classRepo = classRepo;
        this.userRepo = userRepo;
    }

    @GetMapping("/classes")
    public List<ClassRoom> classes() {
        return classRepo.findAll();
    }

    @PostMapping("/attendance/mark")
    public Map<String, Object> mark(@RequestBody MarkAttendanceRequest req, Authentication auth) {
        if (req.getClassRoomId() == null || req.getDate() == null || req.getRecords() == null) {
            throw new RuntimeException("classRoomId, date, records required");
        }

        Long classId = req.getClassRoomId();
        LocalDate date = LocalDate.parse(req.getDate());
        ClassRoom cr = classRepo.findById(classId).orElseThrow(() -> new RuntimeException("Class not found"));

        Long markerUserId = Long.valueOf((String) auth.getPrincipal());
        User marker = userRepo.findById(markerUserId).orElse(null);

        for (MarkAttendanceRequest.Record r : req.getRecords()) {
            if (r.getStudentId() == null || r.getStatus() == null) continue;

            AttendanceStatus st = AttendanceStatus.valueOf(r.getStatus());
            Attendance existing = attendanceRepo
                    .findByStudent_IdAndClassRoom_IdAndDate(r.getStudentId(), classId, date)
                    .orElse(null);

            if (existing == null) {
                Student s = studentRepo.findById(r.getStudentId())
                        .orElseThrow(() -> new RuntimeException("Student not found: " + r.getStudentId()));
                Attendance a = Attendance.builder()
                        .student(s).classRoom(cr).date(date).status(st).markedBy(marker)
                        .build();
                attendanceRepo.save(a);
            } else {
                existing.setStatus(st);
                existing.setMarkedBy(marker);
                attendanceRepo.save(existing);
            }
        }

        return Map.of("ok", true);
    }

    @GetMapping("/attendance/class")
    public List<Map<String, Object>> classAttendance(@RequestParam Long classRoomId, @RequestParam String date) {
        LocalDate d = LocalDate.parse(date);

        List<Student> students = studentRepo.findByClassRoom_Id(classRoomId);

        Map<Long, AttendanceStatus> statusMap = new HashMap<>();
        for (Attendance a : attendanceRepo.findByClassRoom_IdAndDate(classRoomId, d)) {
            statusMap.put(a.getStudent().getId(), a.getStatus());
        }

        List<Map<String, Object>> out = new ArrayList<>();
        for (Student s : students) {
            out.add(Map.of(
                    "studentId", s.getId(),
                    "name", s.getName(),
                    "rollNo", s.getRollNo(),
                    "status", statusMap.getOrDefault(s.getId(), AttendanceStatus.ABSENT).name()
            ));
        }
        out.sort(Comparator.comparing(m -> String.valueOf(m.get("rollNo"))));
        return out;
    }
}
