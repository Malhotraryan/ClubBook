
package com.clubbook.backend.controller;

import com.clubbook.backend.Booking;
import com.clubbook.backend.BookingStatus;
import com.clubbook.backend.service.BookingService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Create a new booking
    @PostMapping("/api/bookings")
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    // Get all bookings
    @GetMapping("/api/bookings")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    // Get only pending bookings
    @GetMapping("/api/bookings/pending")
    public List<Booking> getPendingBookings() {
        return bookingService.getPendingBookings();
    }

    // Approve a booking
    @PutMapping("/api/bookings/{id}/approve")
    public Booking approveBooking(@PathVariable String id) {
        return bookingService.updateBookingStatus(
                id,
                BookingStatus.APPROVED
        );
    }

    // Reject a booking
    @PutMapping("/api/bookings/{id}/reject")
    public Booking rejectBooking(@PathVariable String id) {
        return bookingService.updateBookingStatus(
                id,
                BookingStatus.REJECTED
        );
    }
}
