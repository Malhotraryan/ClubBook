
package com.clubbook.backend.service;

import com.clubbook.backend.Event;
import com.clubbook.backend.EventStatus;
import com.clubbook.backend.Booking;
import com.clubbook.backend.BookingStatus;
import com.clubbook.backend.User;
import com.clubbook.backend.UserRole;

import com.clubbook.backend.dto.EventBookingRequest;
import com.clubbook.backend.repository.EventRepository;
import com.clubbook.backend.repository.BookingRepository;
import com.clubbook.backend.repository.UserRepository;
import com.clubbook.backend.repository.RoomRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;
import java.util.UUID;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;
    private final UserRepository userRepository;
    private final RoomRepository roomRepository;

    public EventService(
            EventRepository eventRepository,
            BookingRepository bookingRepository,
            BookingService bookingService,
            UserRepository userRepository,
            RoomRepository roomRepository) {

        this.eventRepository = eventRepository;
        this.bookingRepository = bookingRepository;
        this.bookingService = bookingService;
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
    }

    // Create an event and its room booking together
    @Transactional
    public Event createEventWithBooking(
            EventBookingRequest request, String email) {

        if (request == null || request.getEvent() == null
                || request.getBooking() == null) {
            throw new IllegalArgumentException(
                    "Event and booking details are required!");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found!"));

        // Only CLUB users can create events
        if (user.getRole() != UserRole.CLUB) {
            throw new AccessDeniedException(
                    "Only club accounts can create events."
            );
        }

        Event event = request.getEvent();
        Booking booking = request.getBooking();

        if (event.getTitle() == null || event.getTitle().isBlank()) {
            throw new IllegalArgumentException("Event title is required!");
        }

        // Never trust the club name submitted by the frontend
        event.setClubName(user.getClubName());
        booking.setClubName(user.getClubName());

        // Both records must contain matching information
        if (event.getClubName() == null
                || !event.getClubName().equals(booking.getClubName())
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
        Booking savedBooking = bookingService.createBooking(booking, email);

        // Connect the event to the newly created booking
        event.setBookingId(savedBooking.getId());
        event.setStatus(EventStatus.PENDING);

        return eventRepository.save(event);
    }

    // Publicly visible events with their venue
    public List<Event> getApprovedEvents() {

        return eventRepository.findByStatus(EventStatus.APPROVED)
                .stream()
                .filter(event -> {
                    Booking booking = bookingRepository
                            .findById(event.getBookingId())
                            .orElse(null);

                    if (booking == null
                            || booking.getStatus() != BookingStatus.APPROVED) {
                        return false;
                    }

                    roomRepository.findById(booking.getRoomId())
                            .ifPresent(room ->
                                    event.setVenue(
                                            room.getName() + ", " + room.getBuilding()
                                    )
                            );

                    return true;
                })
                .toList();
    }

    // ADMIN gets all events; CLUB gets only its own events
    public List<Event> getEventsForUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found!"));

        if (user.getRole() == UserRole.ADMIN) {
            return eventRepository.findAll();
        }

        return eventRepository.findByClubName(user.getClubName());
    }

    // Admin-only list
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Admin-only pending events
    public List<Event> getPendingEvents() {
        return eventRepository.findByStatus(EventStatus.PENDING);
    }

    // Admin-only approval/rejection
    @Transactional
    public Event updateEventStatus(String id, EventStatus newStatus) {

        Event event = eventRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException("Event not found!"));

        Booking booking = bookingRepository.findById(event.getBookingId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Associated booking not found!"));

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

        event.setStatus(newStatus);

        return eventRepository.save(event);
    }
}
