
package com.clubbook.backend.service;

import com.clubbook.backend.Booking;
import com.clubbook.backend.BookingStatus;
import com.clubbook.backend.repository.BookingRepository;

import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;

    public BookingService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    // Create a new booking request
    public Booking createBooking(Booking booking) {

        if (booking.getClubName() == null || booking.getClubName().isBlank()) {
            throw new IllegalArgumentException("Club name is required!");
        }

        if (booking.getPurpose() == null || booking.getPurpose().isBlank()) {
            throw new IllegalArgumentException("Booking purpose is required!");
        }

        if (booking.getAttendees() <= 0) {
            throw new IllegalArgumentException("Attendees must be greater than zero!");
        }

        LocalTime start = LocalTime.parse(booking.getStartTime());
        LocalTime end = LocalTime.parse(booking.getEndTime());

        if (!end.isAfter(start)) {
            throw new IllegalArgumentException("End time must be after start time!");
        }

        // Every new booking starts as PENDING
        booking.setStatus(BookingStatus.PENDING);

        // Find bookings for the same room and date
        List<Booking> existingBookings =
                bookingRepository.findByRoomIdAndDate(
                        booking.getRoomId(),
                        booking.getDate()
                );

        // Check whether an approved booking already occupies this time
        for (Booking existing : existingBookings) {

            if (existing.getStatus() != BookingStatus.APPROVED) {
                continue;
            }

            LocalTime existingStart = LocalTime.parse(existing.getStartTime());
            LocalTime existingEnd = LocalTime.parse(existing.getEndTime());

            if (start.isBefore(existingEnd) && end.isAfter(existingStart)) {
                throw new IllegalArgumentException(
                        "Room is already booked during this time!"
                );
            }
        }

        return bookingRepository.save(booking);
    }

    // Get all bookings
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    // Get only pending bookings
    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING);
    }

    // Approve or reject a booking
    public Booking updateBookingStatus(String id, BookingStatus newStatus) {

        // Find the booking using its ID
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Booking not found!")
                );

        // Check for conflicts only when approving
        if (newStatus == BookingStatus.APPROVED) {

            List<Booking> existingBookings =
                    bookingRepository.findByRoomIdAndDate(
                            booking.getRoomId(),
                            booking.getDate()
                    );

            LocalTime start = LocalTime.parse(booking.getStartTime());
            LocalTime end = LocalTime.parse(booking.getEndTime());

            for (Booking existing : existingBookings) {

                // Ignore the booking being approved
                if (existing.getId().equals(id)) {
                    continue;
                }

                // Only approved bookings block the room
                if (existing.getStatus() != BookingStatus.APPROVED) {
                    continue;
                }

                LocalTime existingStart =
                        LocalTime.parse(existing.getStartTime());

                LocalTime existingEnd =
                        LocalTime.parse(existing.getEndTime());

                // Check whether the time slots overlap
                if (start.isBefore(existingEnd) && end.isAfter(existingStart)) {
                    throw new IllegalArgumentException(
                            "Another approved booking already occupies this time slot!"
                    );
                }
            }
        }

        // Update the booking status
        booking.setStatus(newStatus);

        // Save the updated booking in the database
        return bookingRepository.save(booking);
    }
}
