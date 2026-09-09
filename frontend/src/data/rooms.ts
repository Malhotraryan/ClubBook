import type { Room } from "../components/rooms/RoomCard";

// Temporary frontend-only data, shared by the Rooms page and the
// Book Room form. Will be replaced by a Spring Boot API call
// (e.g. GET /api/rooms) later.
export const rooms: Room[] = [
  {
    id: "room-1",
    name: "Room 204",
    building: "Engineering Block",
    capacity: 60,
    facilities: ["Projector", "Whiteboard", "AC"],
    status: "AVAILABLE",
  },
  {
    id: "room-2",
    name: "Room 110",
    building: "Arts Block",
    capacity: 40,
    facilities: ["Whiteboard", "Speakers"],
    status: "AVAILABLE",
  },
  {
    id: "room-3",
    name: "Main Auditorium",
    building: "Central Block",
    capacity: 250,
    facilities: ["Projector", "Stage", "Sound System", "AC"],
    status: "AVAILABLE",
  },
  {
    id: "room-4",
    name: "Room 305",
    building: "Engineering Block",
    capacity: 30,
    facilities: ["Whiteboard"],
    status: "MAINTENANCE",
  },
  {
    id: "room-5",
    name: "Seminar Hall 2",
    building: "Science Block",
    capacity: 80,
    facilities: ["Projector", "AC", "Video Conferencing"],
    status: "AVAILABLE",
  },
  {
    id: "room-6",
    name: "Room 118",
    building: "Science Block",
    capacity: 45,
    facilities: ["Whiteboard", "AC"],
    status: "MAINTENANCE",
  },
];