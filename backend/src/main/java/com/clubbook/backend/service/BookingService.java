
package com.clubbook.backend.service;

import com.clubbook.backend.Booking;
import com.clubbook.backend.BookingStatus;
import com.clubbook.backend.User;
import com.clubbook.backend.UserRole;
import com.clubbook.backend.repository.BookingRepository;
import com.clubbook.backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public BookingService(
            BookingRepository bookingRepository,
            UserRepository userRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
    }

    // Create a booking using the authenticated user's identity
    public Booking createBooking(Booking booking, String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found!"));

        // Only CLUB users can create bookings
        if (user.getRole() != UserRole.CLUB) {
            throw new AccessDeniedException(
                    "Only club accounts can create bookings."
            );
        }

        // Never trust the club name submitted by the frontend
        booking.setClubName(user.getClubName());

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

        booking.setStatus(BookingStatus.PENDING);

        List<Booking> existingBookings =
                bookingRepository.findByRoomIdAndDate(
                        booking.getRoomId(),
                        booking.getDate()
                );

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

    // ADMIN gets all bookings; CLUB gets only its own bookings
    public List<Booking> getBookingsForUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found!"));

        if (user.getRole() == UserRole.ADMIN) {
            return bookingRepository.findAll();
        }

        return bookingRepository.findByClubName(user.getClubName());
    }

    // Admin-only pending bookings
    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatus(BookingStatus.PENDING);
    }

    // Admin-only approval/rejection
    public Booking updateBookingStatus(String id, BookingStatus newStatus) {

        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Booking not found!"));

        if (newStatus == BookingStatus.APPROVED) {

            List<Booking> existingBookings =
                    bookingRepository.findByRoomIdAndDate(
                            booking.getRoomId(),
                            booking.getDate()
                    );

            LocalTime start = LocalTime.parse(booking.getStartTime());
            LocalTime end = LocalTime.parse(booking.getEndTime());

            for (Booking existing : existingBookings) {

                if (existing.getId().equals(id)) {
                    continue;
                }

                if (existing.getStatus() != BookingStatus.APPROVED) {
                    continue;
                }

                LocalTime existingStart =
                        LocalTime.parse(existing.getStartTime());

                LocalTime existingEnd =
                        LocalTime.parse(existing.getEndTime());

                if (start.isBefore(existingEnd) && end.isAfter(existingStart)) {
                    throw new IllegalArgumentException(
                            "Another approved booking already occupies this time slot!"
                    );
                }
            }
        }

        booking.setStatus(newStatus);
        return bookingRepository.save(booking);
    }
}
