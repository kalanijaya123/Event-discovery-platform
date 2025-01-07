import { useEffect, useState } from "react";
import axiosClient from "./axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "./context/ContextProvider.jsx";
import './Dashboard.css'; 

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { setNotification, user } = useStateContext(); 

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = () => {
    setLoading(true);
    axiosClient.get("/events")
      .then(({ data }) => {
        setLoading(false);
        setEvents(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDeleteClick = event => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }
    axiosClient.delete(`/events/${event.id}`)
      .then(() => {
        setNotification("Event was successfully deleted");
        getEvents();
      });
  };

  const onBookClick = event => {
    // Implement your booking logic here
    alert(`Booking ticket for event: ${event.name}`);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter events based on the search query
  const filteredEvents = events.filter((event) => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      event.location.toLowerCase().includes(lowerCaseQuery) ||
      event.description.toLowerCase().includes(lowerCaseQuery) ||
      new Date(event.start_time).toLocaleDateString().includes(lowerCaseQuery) // Search by date
    );
  });

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Events Dashboard</h1>
        {user && user.role === 'admin' && (
          <Link className="btn-add" to="/events/new">Add New Event</Link>
        )}
      </div>

      <div className="search-container">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search by location, date, or description..." 
          value={searchQuery} 
          onChange={handleSearchChange}
        />
      </div>

      {loading && <div className="loading-text">Loading events...</div>}

      {!loading && filteredEvents.length === 0 && <div className="no-events">No events found matching the search criteria.</div>}

      <div className="cards-container">
        {filteredEvents.map((event) => (
          <div className="event-card" key={event.id}>
            <div className="event-image">
              {event.image_path && (
                <img
                  src={`http://localhost:8000/storage/${event.image_path}`}
                  alt={event.name}
                  className="event-img"
                />
              )}
            </div>
            <div className="event-info">
              <h3>{event.name}</h3>
              <p>{event.description}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Start:</strong> {new Date(event.start_time).toLocaleString()}</p>
              <p><strong>End:</strong> {new Date(event.end_time).toLocaleString()}</p>
            </div>
            <div className="event-actions">
              {user && user.role === 'admin' ? (
                <>
                  <Link className="btn-edit" to={`/events/${event.id}`}>Edit</Link>
                  <button className="btn-delete" onClick={() => onDeleteClick(event)}>Delete</button>
                </>
              ) : (
                <button className="btn-book" onClick={() => onBookClick(event)}>Book Ticket</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
