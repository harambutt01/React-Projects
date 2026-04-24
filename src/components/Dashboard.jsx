import useFetch from "../hooks/useFetch";
import { useTheme } from "./ThemeContext";
import "./Dashboard.css";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function Dashboard() {
  const { isDark } = useTheme();
  const theme = isDark ? "dark" : "light";
  const { data, loading, error } = useFetch(API_URL);

  return (
    <div className={`dashboard-page ${theme}`}>

      <div className="dashboard-header">
        <h2 className={`dashboard-title ${theme}`}>Users</h2>
      </div>

      {loading && (
        <div className="spinner-wrapper">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}

      {error && (
        <p className="error-msg">{error}</p>
      )}

      {!loading && !error && data.length === 0 && (
        <p className="empty-msg">No data available.</p>
      )}

      {!loading && !error && data.length > 0 && (
        <div className="table-wrapper">
          <table className={`data-table ${theme}`}>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>City</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.address.city}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

export default Dashboard;