import { useState } from "react";

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

    fields.forEach((key) => {
      newErrors[key] = validate(key, values[key]);
      newTouched[key] = true;
    });

    setErrors(newErrors);
    setTouched(newTouched);

    const hasError = fields.some((field) => newErrors[field] !== "");

    if (!hasError) {
      alert("Registration successful!");
      setValues({ name: "", email: "", password: "", confirmPassword: "" });
      setErrors({});
      setTouched({});
    }
  };

  return (
    /* Changed: pt-24 ensures it starts below navbar. 
       Changed: items-start to ensure it doesn't try to vertically center in a way that hides top content */
    <div className="flex justify-center items-start px-[16px] pt-24 pb-10 min-h-screen bg-gray-50">
      <div className="w-full max-w-[480px] bg-white border border-[#e0e0e0] rounded-[12px] px-[32px] py-[36px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] sm:px-[18px] sm:py-[24px]">

        <h2 className="m-0 mb-[6px] text-[1.5rem] font-[700] text-[#111]">
          Create Account
        </h2>

        <p className="m-0 mb-[28px] text-[0.875rem] text-[#888]">
          Fill in the details below to register.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {/* Name Field */}
          <div className="flex flex-col mb-[20px]">
            <label className="text-[0.82rem] font-[600] text-[#444] mb-[6px]">Name</label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your name"
              className={`px-[14px] py-[10px] border rounded-[8px] text-[0.9rem] outline-none transition-colors duration-200 text-[#111] ${
                touched.name && errors.name ? "border-[#e53935]" : "border-[#ddd] focus:border-[#4f6ef7]"
              }`}
            />
            {touched.name && errors.name && <span className="mt-[5px] text-[0.78rem] text-[#e53935]">{errors.name}</span>}
          </div>

          {/* Email Field */}
          <div className="flex flex-col mb-[20px]">
            <label className="text-[0.82rem] font-[600] text-[#444] mb-[6px]">Email</label>
            <input
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email"
              className={`px-[14px] py-[10px] border rounded-[8px] text-[0.9rem] outline-none transition-colors duration-200 text-[#111] ${
                touched.email && errors.email ? "border-[#e53935]" : "border-[#ddd] focus:border-[#4f6ef7]"
              }`}
            />
            {touched.email && errors.email && <span className="mt-[5px] text-[0.78rem] text-[#e53935]">{errors.email}</span>}
          </div>

          {/* Password Field */}
          <div className="flex flex-col mb-[20px]">
            <label className="text-[0.82rem] font-[600] text-[#444] mb-[6px]">Password</label>
            <input
              type="password"
              name="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Min. 8 characters"
              className={`px-[14px] py-[10px] border rounded-[8px] text-[0.9rem] outline-none transition-colors duration-200 text-[#111] ${
                touched.password && errors.password ? "border-[#e53935]" : "border-[#ddd] focus:border-[#4f6ef7]"
              }`}
            />
            {touched.password && errors.password && <span className="mt-[5px] text-[0.78rem] text-[#e53935]">{errors.password}</span>}
          </div>

          {/* Confirm Password Field */}
          <div className="flex flex-col mb-[20px]">
            <label className="text-[0.82rem] font-[600] text-[#444] mb-[6px]">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Re-enter your password"
              className={`px-[14px] py-[10px] border rounded-[8px] text-[0.9rem] outline-none transition-colors duration-200 text-[#111] ${
                touched.confirmPassword && errors.confirmPassword ? "border-[#e53935]" : "border-[#ddd] focus:border-[#4f6ef7]"
              }`}
            />
            {touched.confirmPassword && errors.confirmPassword && <span className="mt-[5px] text-[0.78rem] text-[#e53935]">{errors.confirmPassword}</span>}
          </div>

          <button
            type="submit"
            disabled={!isFormValid()}
            className="w-full py-[12px] mt-[8px] bg-[#4f6ef7] text-white rounded-[8px] text-[0.95rem] font-[600] cursor-pointer transition-colors duration-200 hover:bg-[#3a58e0] disabled:bg-[#b0b8f0] disabled:cursor-not-allowed"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Contact;