
package com.clubbook.backend.controller;

import com.clubbook.backend.Event;
import com.clubbook.backend.EventStatus;
import com.clubbook.backend.dto.EventBookingRequest;
import com.clubbook.backend.service.EventService;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    // Create event and room booking together
    @PostMapping("/api/events/create-with-booking")
    public Event createEventWithBooking(
            @RequestBody EventBookingRequest request) {

        return eventService.createEventWithBooking(request);
    }

    // Public events
    @GetMapping("/api/events")
    public List<Event> getApprovedEvents() {
        return eventService.getApprovedEvents();
    }

    // All events for admin
    @GetMapping("/api/events/all")
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // Pending events for admin
    @GetMapping("/api/events/pending")
    public List<Event> getPendingEvents() {
        return eventService.getPendingEvents();
    }

    // Approve event
    @PutMapping("/api/events/{id}/approve")
    public Event approveEvent(@PathVariable String id) {
        return eventService.updateEventStatus(id, EventStatus.APPROVED);
    }

    // Reject event
    @PutMapping("/api/events/{id}/reject")
    public Event rejectEvent(@PathVariable String id) {
        return eventService.updateEventStatus(id, EventStatus.REJECTED);
    }
}
