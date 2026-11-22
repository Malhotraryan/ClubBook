
package com.clubbook.backend.service;

import com.clubbook.backend.Event;
import com.clubbook.backend.EventStatus;
import com.clubbook.backend.Booking;
import com.clubbook.backend.BookingStatus;

import com.clubbook.backend.dto.EventBookingRequest;
import com.clubbook.backend.repository.EventRepository;
import com.clubbook.backend.repository.BookingRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public EventService(
            EventRepository eventRepository,
            BookingRepository bookingRepository,
            BookingService bookingService) {

        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
    }

    // Create an event and its room booking together
    @Transactional
    public Event createEventWithBooking(EventBookingRequest request) {

        if (request == null || request.getEvent() == null
                || request.getBooking() == null) {
            throw new IllegalArgumentException(
                    "Event and booking details are required!");
        }

        Event event = request.getEvent();
        Booking booking = request.getBooking();

        if (event.getTitle() == null || event.getTitle().isBlank()) {
            throw new IllegalArgumentException("Event title is required!");
        }

        // Both records must contain matching information
        if (!event.getClubName().equals(booking.getClubName())
                || !event.getDate().equals(booking.getDate())
                || !event.getStartTime().equals(booking.getStartTime())
                || !event.getEndTime().equals(booking.getEndTime())
                || event.getExpectedAttendees() != booking.getAttendees()) {

            throw new IllegalArgumentException(
                    "Event and booking details must match!");
        }

        // Generate IDs on the backend
        booking.setId(UUID.randomUUID().toString());
        event.setId(UUID.randomUUID().toString());

        // Create the room booking using existing validation
        Booking savedBooking = bookingService.createBooking(booking);

        // Connect the event to the newly created booking
        event.setBookingId(savedBooking.getId());
        event.setStatus(EventStatus.PENDING);

        return eventRepository.save(event);
    }

    // Get publicly visible events
    public List<Event> getApprovedEvents() {

        return eventRepository.findByStatus(EventStatus.APPROVED)
                .stream()
                .filter(event ->
                        bookingRepository.findById(event.getBookingId())
                                .map(booking ->
                                        booking.getStatus() == BookingStatus.APPROVED)
                                .orElse(false))
                .toList();
    }

    // Get all events
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Get pending events
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING);
    }

    // Approve or reject an event
    // Approve or reject an event and its associated booking
    @Transactional
    public Event updateEventStatus(String id, EventStatus newStatus) {

        // Find the event
        Event event = eventRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Event not found!"));

        // Find its associated booking
        Booking booking = bookingRepository.findById(event.getBookingId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Associated booking not found!"));

        // Update booking according to the event decision
        if (newStatus == EventStatus.APPROVED) {

            bookingService.updateBookingStatus(
                    booking.getId(),
                    BookingStatus.APPROVED
            );

        } else if (newStatus == EventStatus.REJECTED) {

            bookingService.updateBookingStatus(
                    booking.getId(),
                    BookingStatus.REJECTED
            );
        }

        // Update event status
        event.setStatus(newStatus);

        return eventRepository.save(event);
    }
}
