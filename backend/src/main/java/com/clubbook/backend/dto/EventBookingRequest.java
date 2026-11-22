
package com.clubbook.backend.dto;

import com.clubbook.backend.Event;
import com.clubbook.backend.Booking;

public class EventBookingRequest {

    private Event event;
    private Booking booking;

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }
}
