import { useState, useEffect, useCallback } from "react";
import StatusDisplay from "./StatusDisplay";
import "./Toggle.css";

const STORAGE_KEY = "user_profile_status";

function Toggle() {
  const [isOnline, setIsOnline] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    console.log(
      `[Status Update] User is now: ${isOnline ? "Online" : "Offline"}`
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(isOnline));
  }, [isOnline]);

  const toggleStatus = useCallback(() => {
    setIsOnline((prev) => !prev);
  }, []);

  return (
    <div className="app">
      <div className="right-panel">

        <div className="avatar-wrapper">
          <svg
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="avatar-svg"
          >
            <circle cx="32" cy="24" r="12" fill="currentColor" opacity="0.9" />
            <path
              d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              opacity="0.9"
            />
          </svg>

          <span
            className={`avatar-dot ${
              isOnline ? "dot-online" : "dot-offline"
            }`}
          />
        </div>


        {/* <StatusDisplay isOnline={isOnline} /> */}

        <button
          className={`toggle-switch ${
            isOnline ? "toggle-on" : "toggle-off"
          }`}
          onClick={toggleStatus}
        >
          <span className="toggle-thumb" />
        </button>

      </div>
    </div>
  );
}

export default Toggle;