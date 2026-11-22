
package com.clubbook.backend;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "events")
public class Event {

    @Id
    private String id;

    private String title;
    private String description;
    private String clubName;

    private String date;
    private String startTime;
    private String endTime;

    private int expectedAttendees;

    // Connects this event to its room booking
    private String bookingId;

    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.PENDING;

    public Event() {
    }

    public Event(String id, String title, String description,
                 String clubName, String date, String startTime,
                 String endTime, int expectedAttendees, String bookingId) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.clubName = clubName;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.expectedAttendees = expectedAttendees;
        this.bookingId = bookingId;
        this.status = EventStatus.PENDING;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getClubName() {
        return clubName;
    }

    public void setClubName(String clubName) {
        this.clubName = clubName;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public int getExpectedAttendees() {
        return expectedAttendees;
    }

    public void setExpectedAttendees(int expectedAttendees) {
        this.expectedAttendees = expectedAttendees;
    }

    public String getBookingId() {
        return bookingId;
    }

    public void setBookingId(String bookingId) {
        this.bookingId = bookingId;
    }

    public EventStatus getStatus() {
        return status;
    }

    public void setStatus(EventStatus status) {
        this.status = status;
    }
}
