import useFetch from "../hooks/useFetch";
import { useTheme } from "./ThemeContext";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function Dashboard() {
  const { isDark } = useTheme();
  const themeClass = isDark ? "dark" : "light";
  const { data, loading, error } = useFetch(API_URL);

  return (
    /* .dashboard-page { padding: 24px; min-height: 100vh; transition: background 0.3s ease; } */
    <div className={`pt-24 px-6 min-h-screen transition-all duration-300 ${isDark ? "bg-[#121212]" : "bg-[#f5f5f5]"}`}>
      
      {/* .dashboard-header { margin-bottom: 20px; } */}
      <div className="mb-5">
        {/* .dashboard-title { margin: 0 0 4px; font-size: 1.5rem; font-weight: 700; } */}
        <h2 className={`text-2xl font-bold mb-1 ${isDark ? "text-[#e0e0e0]" : "text-[#111]"}`}>
          Users
        </h2>
      </div>

      {error && <p className="text-[#e53935] text-center p-5 font-medium">{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p className="text-center py-[60px] text-gray-500">No data available.</p>
      )}

      {(loading || (!error && data.length > 0)) && (
        /* .table-wrapper { overflow-x: auto; width: 100%; } */
        <div className="overflow-x-auto w-full rounded-lg shadow-sm">
          
          {/* .data-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; table-layout: fixed; } */}
          <table className={`w-full border-collapse text-[0.9rem] table-fixed md:table-fixed sm:table-auto ${isDark ? "bg-[#1e1e1e] text-[#e0e0e0]" : "bg-white text-[#111]"}`}>
            
            <thead className={`${isDark ? "bg-[#2a2a2a] text-[#aaa]" : "bg-[#f0f0f0] text-[#555]"}`}>
              <tr>
                {/* Specific column widths matching your CSS */}
                <th className="p-3 px-4 text-left text-[0.78rem] font-bold uppercase tracking-wider border-b border-opacity-10 w-[50px]">#</th>
                <th className="p-3 px-4 text-left text-[0.78rem] font-bold uppercase tracking-wider border-b border-opacity-10 w-1/4">Name</th>
                <th className="p-3 px-4 text-left text-[0.78rem] font-bold uppercase tracking-wider border-b border-opacity-10 w-[30%]">Email</th>
                <th className="p-3 px-4 text-left text-[0.78rem] font-bold uppercase tracking-wider border-b border-opacity-10 w-1/5">Phone</th>
                <th className="p-3 px-4 text-left text-[0.78rem] font-bold uppercase tracking-wider border-b border-opacity-10 w-1/5">City</th>
              </tr>
            </thead>

            <tbody>
              {loading
                ? Array(5).fill(0).map((_, index) => (
                    <tr key={index}>
                      {Array(5).fill(0).map((_, i) => (
                        <td key={i} className={`p-3 px-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>
                          {/* .skeleton-cell with shimmer effect */}
                          <div className={`h-[18px] w-[90%] rounded relative overflow-hidden animate-pulse ${isDark ? "bg-[#333]" : "bg-[#ececec]"}`}></div>
                        </td>
                      ))}
                    </tr>
                  ))
                : data.map((user) => (
                    <tr key={user.id} className={`transition-colors ${isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-50"}`}>
                      <td className={`p-3 px-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.id}</td>
                      <td className={`p-3 px-4 border-b font-medium ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.name}</td>
                      <td className={`p-3 px-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.email}</td>
                      <td className={`p-3 px-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.phone}</td>
                      <td className={`p-3 px-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.address.city}</td>
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