package com.clubbook.backend.service;

import com.clubbook.backend.Room;
import com.clubbook.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public Room addRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room getRoomById(String id) {
        return roomRepository.findById(id).orElse(null);
    }

    public Room updateRoom(String id, Room updatedRoom) {
        if (!roomRepository.existsById(id)) {
            return null;
        }

        updatedRoom.setId(id);
        return roomRepository.save(updatedRoom);
    }

    public boolean deleteRoom(String id) {
        if (!roomRepository.existsById(id)) {
            return false;
        }

        roomRepository.deleteById(id);
        return true;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}