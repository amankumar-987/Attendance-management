package com.example.attendance.controller;

import com.example.attendance.model.ClassRoom;
import com.example.attendance.model.Student;
import com.example.attendance.repo.ClassRoomRepository;
import com.example.attendance.repo.StudentRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {

    private final ClassRoomRepository classRepo;
    private final StudentRepository studentRepo;

    public AdminController(ClassRoomRepository classRepo, StudentRepository studentRepo) {
        this.classRepo = classRepo;
        this.studentRepo = studentRepo;
    }

    @PostMapping("/classes")
    public ClassRoom createClass(@RequestBody ClassRoom c) {
        if (c.getName() == null || c.getName().isBlank()) {
            throw new RuntimeException("Class name required");
        }
        return classRepo.save(c);
    }

    @GetMapping("/classes")
    public List<ClassRoom> listClasses() {
        return classRepo.findAll();
    }

    @PostMapping("/students")
    public Student createStudent(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        String rollNo = body.get("rollNo");
        String classRoomIdStr = body.get("classRoomId");

        if (name == null || rollNo == null || classRoomIdStr == null) {
            throw new RuntimeException("name, rollNo, classRoomId required");
        }

        Long classRoomId = Long.valueOf(classRoomIdStr);
        ClassRoom cr = classRepo.findById(classRoomId).orElseThrow(() -> new RuntimeException("Class not found"));

        // roll no unique check
        studentRepo.findByRollNo(rollNo).ifPresent(s -> {
            throw new RuntimeException("rollNo already exists");
        });

        Student s = Student.builder()
                .name(name)
                .rollNo(rollNo)
                .classRoom(cr)
                .build();

        return studentRepo.save(s);
    }

    @GetMapping("/students")
    public List<Student> listStudents() {
        return studentRepo.findAll();
    }
}
