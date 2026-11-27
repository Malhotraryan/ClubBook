package com.clubbook.backend.service;

import com.clubbook.backend.Booking;
import com.clubbook.backend.BookingStatus;
import com.clubbook.backend.Room;
import com.clubbook.backend.dto.RoomBookingResponse;
import com.clubbook.backend.repository.BookingRepository;
import com.clubbook.backend.repository.RoomRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;

    public RoomService(
            RoomRepository roomRepository,
            BookingRepository bookingRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
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

    public List<RoomBookingResponse> getUpcomingBookings(String roomId) {

        if (!roomRepository.existsById(roomId)) {
            throw new IllegalArgumentException("Room not found!");
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<Booking> bookings =
                bookingRepository
                        .findByRoomIdAndStatusAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(
                                roomId,
                                BookingStatus.APPROVED,
                                today.toString()
                        );

        return bookings.stream()
                .filter(booking -> {
                    LocalDate bookingDate = LocalDate.parse(booking.getDate());
                    LocalTime bookingStart = LocalTime.parse(booking.getStartTime());

                    return bookingDate.isAfter(today)
                            || (bookingDate.isEqual(today) && bookingStart.isAfter(now));
                })
                .map(booking -> new RoomBookingResponse(
                        booking.getId(),
                        booking.getDate(),
                        booking.getStartTime(),
                        booking.getEndTime(),
                        booking.getPurpose(),
                        booking.getClubName()
                ))
                .toList();
    }
}
