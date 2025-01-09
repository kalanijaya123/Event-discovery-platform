import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { Link } from "react-router-dom";
import { useStateContext } from "../context/ContextProvider.jsx";


const getCsrfToken = () => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  return csrfToken;
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getEvents();
  }, []);

  const onDeleteClick = (event) => {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

   
    const csrfToken = getCsrfToken();

    axiosClient
      .delete(`/events/${event.id}`, {
        headers: {
          'X-XSRF-TOKEN': csrfToken, 
        },
      })
      .then(() => {
        setNotification('Event was successfully deleted');
        getEvents();
      });
  };

  const getEvents = () => {
    setLoading(true);
    
   
    const csrfToken = getCsrfToken();

    axiosClient
      .get('/events', {
        headers: {
          'X-XSRF-TOKEN': csrfToken, 
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setEvents(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
        <h1>Events</h1>
        <Link className="btn-add" to="/events/new">Add new Event</Link>
      </div>
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              <th>Start_time</th>
              <th>End_time</th>
              <th>Location</th>
              <th>Image_path</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading &&
            <tbody>
              <tr>
                <td colSpan="8" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>{e.description}</td>
                  <td>{e.start_time}</td>
                  <td>{e.end_time}</td>
                  <td>{e.location}</td>
                  <td>{e.image_path}</td>
                  <td>
                    <Link className="btn-edit" to={'/events/' + e.id}>Edit</Link>
                    &nbsp;
                    <button className="btn-delete" onClick={() => onDeleteClick(e)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  );
}
