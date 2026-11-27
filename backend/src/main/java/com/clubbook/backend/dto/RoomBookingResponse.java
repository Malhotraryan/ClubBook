package com.clubbook.backend.dto;

public record RoomBookingResponse(
        String id,
        String date,
        String startTime,
        String endTime,
        String purpose,
        String clubName
) {
}
