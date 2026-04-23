import { useState } from "react";
import "./Contact.css";

function Contact() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validate = (name, value) => {
    if (name === "name") {
      if (!value.trim()) return "Name is required.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
    }

    if (name === "email") {
      if (!value.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
    }

    if (name === "password") {
      if (!value) return "Password is required.";
      if (value.length < 8) return "Password must be at least 8 characters.";
    }

    if (name === "confirmPassword") {
      if (!value) return "Please confirm your password.";
      if (value !== values.password) return "Passwords do not match.";
    }

    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const isFormValid = () => {
    const fields = ["name", "email", "password", "confirmPassword"];
    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      if (!values[key].trim()) return false;
      if (validate(key, values[key]) !== "") return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fields = ["name", "email", "password", "confirmPassword"];
    const newErrors = {};
    const newTouched = {};

    for (let i = 0; i < fields.length; i++) {
      const key = fields[i];
      newErrors[key] = validate(key, values[key]);
      newTouched[key] = true;
    }

    setErrors(newErrors);
    setTouched(newTouched);

    let hasError = false;
    for (let i = 0; i < fields.length; i++) {
      if (newErrors[fields[i]] !== "") {
        hasError = true;
        break;
      }
    }

    if (!hasError) {
      alert("Registration successful!");
      setValues({ name: "", email: "", password: "", confirmPassword: "" });
      setErrors({});
      setTouched({});
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2 className="form-title">Create Account</h2>
        <p className="form-subtitle">Fill in the details below to register.</p>

        <form onSubmit={handleSubmit} noValidate>

          <div className="field">
            <label className="label">Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your name"
              className={`input ${touched.name && errors.name ? "input-error" : ""}`}
            />
            {touched.name && errors.name && (
              <span className="error">{errors.name}</span>
            )}
          </div>

          <div className="field">
            <label className="label">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={`input ${touched.email && errors.email ? "input-error" : ""}`}
            />
            {touched.email && errors.email && (
              <span className="error">{errors.email}</span>
            )}
          </div>

          <div className="field">
            <label className="label">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Min. 8 characters"
              className={`input ${touched.password && errors.password ? "input-error" : ""}`}
            />
            {touched.password && errors.password && (
              <span className="error">{errors.password}</span>
            )}
          </div>

          <div className="field">
            <label className="label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              className={`input ${touched.confirmPassword && errors.confirmPassword ? "input-error" : ""}`}
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="error">{errors.confirmPassword}</span>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={!isFormValid()}
          >
            Register
          </button>

        </form>
      </div>
    </div>
  );
}

export default Contact;