package com.clubbook.backend.controller;

import org.springframework.web.bind.annotation.CrossOrigin;

import com.clubbook.backend.Room;
import com.clubbook.backend.service.RoomService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    // Get all rooms
    @GetMapping("/api/rooms")
    public List<Room> getRooms() {
        return roomService.getAllRooms();
    }

    // Get room by ID
    @GetMapping("/api/rooms/{id}")
    public Room getRoomById(@PathVariable String id) {
        return roomService.getRoomById(id);
    }

    // Update room
    @PutMapping("/api/rooms/{id}")
    public Room updateRoom(
            @PathVariable String id,
            @RequestBody Room room) {
        return roomService.updateRoom(id, room);
    }

    // Delete room
    @DeleteMapping("/api/rooms/{id}")
    public String deleteRoom(@PathVariable String id) {
        boolean deleted = roomService.deleteRoom(id);

        return deleted
                ? "Room deleted successfully!"
                : "Room not found!";
    }

    // Add a new room
    @PostMapping("/api/rooms")
    public Room addRoom(@RequestBody Room room) {
        return roomService.addRoom(room);
    }
}