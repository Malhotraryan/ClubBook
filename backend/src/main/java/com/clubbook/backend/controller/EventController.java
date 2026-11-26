
package com.clubbook.backend.controller;

import com.clubbook.backend.Event;
import com.clubbook.backend.EventStatus;
import com.clubbook.backend.dto.EventBookingRequest;
import com.clubbook.backend.service.EventService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // CLUB only: create event with room booking
    @PostMapping("/api/events/create-with-booking")
    @PreAuthorize("hasRole('CLUB')")
    public Event createEventWithBooking(
            @RequestBody EventBookingRequest request,
            Authentication authentication) {

        return eventService.createEventWithBooking(
                request,
                authentication.getName()
        );
    }

    // Public: view approved events
    @GetMapping("/api/events")
    public List<Event> getApprovedEvents() {
        return eventService.getApprovedEvents();
    }

    // CLUB gets its own events; ADMIN gets all events
    @GetMapping("/api/events/mine")
    @PreAuthorize("hasAnyRole('CLUB', 'ADMIN')")
    public List<Event> getMyEvents(Authentication authentication) {
        return eventService.getEventsForUser(authentication.getName());
    }

    // ADMIN only: view all events
    @GetMapping("/api/events/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // ADMIN only: view pending events
    @GetMapping("/api/events/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Event> getPendingEvents() {
        return eventService.getPendingEvents();
    }

    // ADMIN only: approve event
    @PutMapping("/api/events/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public Event approveEvent(@PathVariable String id) {
        return eventService.updateEventStatus(
                id,
                EventStatus.APPROVED
        );
    }

    // ADMIN only: reject event
    @PutMapping("/api/events/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public Event rejectEvent(@PathVariable String id) {
        return eventService.updateEventStatus(
                id,
                EventStatus.REJECTED
        );
    }
}
