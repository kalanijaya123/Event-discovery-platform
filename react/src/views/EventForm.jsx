import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";


const getCsrfToken = () => {
  const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1];
  return csrfToken;
};

export default function EventForm() {
  const navigate = useNavigate();
  let { id } = useParams();

  const [event, setEvent] = useState({
    id: null,
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    location: '',
    image_path: null, 
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/events/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setEvent(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  
  const onSubmit = async (ev) => {
    ev.preventDefault();

    const formData = new FormData();
    Object.keys(event).forEach((key) => {
      formData.append(key, event[key]);
    });

    try {
     
      const csrfToken = getCsrfToken();
      const headers = {
        'Content-Type': 'multipart/form-data',
        'X-XSRF-TOKEN': csrfToken, 
      };

      if (event.id) {
     
        await axiosClient.put(`/events/${event.id}`, formData, { headers });
        setNotification('Event was successfully updated');
       
      } else {
      
        await axiosClient.post('/events', formData, { headers });
        setNotification('Event was successfully created');
        navigate('/events');
      }
    } catch (err) {
      const response = err.response;
      if (response && response.status === 422) {
        setErrors(response.data.errors);
      }
    }
  };

  return (
    <>
      {event.id && <h1>Update Event: {event.name}</h1>}
      {!event.id && <h1>New Event</h1>}
      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors && (
          <div className="alert">
            {Object.keys(errors).map((key) => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        )}
        {!loading && (
          <form onSubmit={onSubmit}>
            <input
              value={event.name}
              onChange={(ev) => setEvent({ ...event, name: ev.target.value })}
              placeholder="Name"
            />
            <textarea
              value={event.description}
              onChange={(ev) =>
                setEvent({ ...event, description: ev.target.value })
              }
              placeholder="Description"
            />
            <input
              type="datetime-local"
              value={event.start_time}
              onChange={(ev) =>
                setEvent({ ...event, start_time: ev.target.value })
              }
              placeholder="Start Time"
            />
            <input
              type="datetime-local"
              value={event.end_time}
              onChange={(ev) =>
                setEvent({ ...event, end_time: ev.target.value })
              }
              placeholder="End Time"
            />
            <input
              value={event.location}
              onChange={(ev) =>
                setEvent({ ...event, location: ev.target.value })
              }
              placeholder="Location"
            />
            <input
              type="file"
              onChange={(ev) =>
                setEvent({ ...event, image_path: ev.target.files[0] })
              }
            />
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  );
}
