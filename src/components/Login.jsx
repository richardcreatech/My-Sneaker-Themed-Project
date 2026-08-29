import { useState } from "react";

function Login() {
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
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.message || "Login failed");
                return;
            }

            console.log("Login response:", data);

            setMessage(data.message);

            // We'll deal with storing the token
            // and navigating to the products page next.
        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }
    };

    return (
        <form className="auth__form" onSubmit={handleSubmit}>
            <div className="field">
                <label className="field__label" htmlFor="login-email">
                    Email
                </label>
                <input
                    id="login-email"
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
                <label className="field__label" htmlFor="login-password">
                    Password
                </label>
                <input
                    id="login-password"
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
                Log in
                <span className="auth__submit-arrow">→</span>
            </button>

            {message && <p className="auth__message">{message}</p>}
        </form>
    );
}

export default Login;