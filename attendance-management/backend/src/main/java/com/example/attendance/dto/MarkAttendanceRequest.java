package com.example.attendance.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter @Setter
public class MarkAttendanceRequest {
    private Long classRoomId;
    private String date; // YYYY-MM-DD
    private List<Record> records;

    @Getter @Setter
    public static class Record {
        private Long studentId;
        private String status; // PRESENT/ABSENT/LATE
    }
}
