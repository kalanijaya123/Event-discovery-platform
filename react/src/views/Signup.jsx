import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import './Signup.css'; 

export default function Signup() {
  const nameRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const passwordConfirmationRef = createRef();
  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState(null);
  const [role, setRole] = useState("user"); 
  const [emailError, setEmailError] = useState(""); 

  const onSubmit = (ev) => {
    ev.preventDefault();

    let email = emailRef.current.value;

    if (role === "admin") {
    
      if (!email.endsWith(".crew@gmail.com")) {
        setEmailError("Admin email must end with .crew@gmail.com");
        return;
      }
      setEmailError(""); 
    }

    const payload = {
      name: nameRef.current.value,
      email: email,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
  };

  return (
    <div className="signup-container">
      <div className="form-container">
        <form onSubmit={onSubmit} className="signup-form">
          <h1 className="form-title">Signup for Free</h1>

          {/* Role selection */}
          <div className="role-selection">
            <label className="role-label">
              <input
                type="radio"
                name="role"
                value="user"
                checked={role === "user"}
                onChange={() => handleRoleChange("user")}
              />
              <span className="role-text">User</span>
            </label>
            <label className="role-label">
              <input
                type="radio"
                name="role"
                value="admin"
                checked={role === "admin"}
                onChange={() => handleRoleChange("admin")}
              />
              <span className="role-text">Admin</span>
            </label>
          </div>

          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}

          {emailError && <div className="alert error">{emailError}</div>}

          <div className="input-group">
            <input ref={nameRef} type="text" placeholder="Full Name" className="input-field" />
          </div>

          <div className="input-group">
            <input
              ref={emailRef}
              type="email"
              placeholder={role === "admin" ? "e.g., yourname.crew@gmail.com" : "Email Address"}
              className="input-field"
            />
          </div>

          <div className="input-group">
            <input ref={passwordRef} type="password" placeholder="Password" className="input-field" />
          </div>

          <div className="input-group">
            <input
              ref={passwordConfirmationRef}
              type="password"
              placeholder="Repeat Password"
              className="input-field"
            />
          </div>

          <button type="submit" className="btn-submit">
            Signup
          </button>

          <p className="message">
            Already registered? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
