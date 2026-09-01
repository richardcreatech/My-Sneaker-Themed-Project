import { useState } from "react";
import { API_BASE_URL } from "../config/api";

function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      setMessage(data.message);

      console.log(data);
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server");
    }
  };

  return (
    <form className="auth__form" onSubmit={handleSubmit}>
      <div className="field">
        <label className="field__label" htmlFor="signup-email">
          Email
        </label>
        <input
          id="signup-email"
          className="field__input"
          type="email"
          name="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="signup-password">
          Password
        </label>
        <input
          id="signup-password"
          className="field__input"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      <button className="auth__submit" type="submit">
        Sign up
        <span className="auth__submit-arrow">→</span>
      </button>

      {message && <p className="auth__message">{message}</p>}
    </form>
  );
}

export default Signup;
