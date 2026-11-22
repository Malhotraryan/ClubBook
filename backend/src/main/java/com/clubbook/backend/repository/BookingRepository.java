
package com.clubbook.backend.repository;

import com.clubbook.backend.Booking;
import com.clubbook.backend.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, String> {

    List<Booking> findByRoomIdAndDate(String roomId, String date);

    List<Booking> findByStatus(BookingStatus status);
}
