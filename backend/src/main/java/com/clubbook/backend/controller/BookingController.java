
package com.clubbook.backend.controller;

import com.clubbook.backend.Booking;
import com.clubbook.backend.BookingStatus;
import com.clubbook.backend.service.BookingService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // CLUB only: create a booking
    @PostMapping("/api/bookings")
    @PreAuthorize("hasRole('CLUB')")
    public Booking createBooking(
            @RequestBody Booking booking,
            Authentication authentication) {

        return bookingService.createBooking(
                booking,
                authentication.getName()
        );
    }

    // CLUB gets its own bookings; ADMIN gets all bookings
    @GetMapping("/api/bookings")
    @PreAuthorize("hasAnyRole('CLUB', 'ADMIN')")
    public List<Booking> getBookings(Authentication authentication) {
        return bookingService.getBookingsForUser(authentication.getName());
    }

    // ADMIN only: view pending bookings
    @GetMapping("/api/bookings/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getPendingBookings() {
        return bookingService.getPendingBookings();
    }

    // ADMIN only: approve booking
    @PutMapping("/api/bookings/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking approveBooking(@PathVariable String id) {
        return bookingService.updateBookingStatus(
                id,
                BookingStatus.APPROVED
        );
    }

    // ADMIN only: reject booking
    @PutMapping("/api/bookings/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public Booking rejectBooking(@PathVariable String id) {
        return bookingService.updateBookingStatus(
                id,
                BookingStatus.REJECTED
        );
    }
}
