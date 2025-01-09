import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client.js";
import "./publicpage.css";

export default function publicpage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

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
  const handleViewMoreClick = () => {
    alert("You need to log in or sign up to view more details.");
  };

  return (
    <div id="guestLayout">
      <header>
        <div className="navbar">
          <div className="auth-buttons">
            <Link to="/login" className="btn-login">Login</Link>
            <Link to="/signup" className="btn-signup">Sign Up</Link>
          </div>
          <div className="nav-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </header>

      <main>
        <div className="overlay">
          <h1 className="main-heading">Welcome to Event Discovery</h1>
          <p className="main-description">Discover amazing events happening around you!</p>
        </div>
        <div className="events-container">
          <h2>Upcoming Events</h2>
          <div className="events-box-grid">
            {events.length > 0 ? (
              events.map((event) => (
                <div className="event-box" key={event.id}>
                  {event.image_path && (
                    <img
                      src={`http://localhost:8000/storage/${event.image_path}`}
                      alt={event.name}
                      className="event-img"
                    />
                  )}
                  <h3>{event.name}</h3>
                  <p>{event.description}</p>
                  <button className="btn-view-more" onClick={handleViewMoreClick}>
                    View More
                  </button>
                </div>
              ))
            ) : (
              <p>No events available at the moment.</p>
            )}
          </div>
        </div>
      </main>

      <footer>
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Event Discovery. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
