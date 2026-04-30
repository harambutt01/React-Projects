import useFetch from "../hooks/useFetch";
import { useTheme } from "./ThemeContext";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function Dashboard() {
  const { isDark } = useTheme();
  const { data, loading, error } = useFetch(API_URL);

  return (
    <div className={`pt-24 px-4 sm:px-6 min-h-screen transition-all duration-300 ${isDark ? "bg-[#121212]" : "bg-[#f5f5f5]"}`}>
      
      <div className="mb-5">
        <h2 className={`text-2xl font-bold mb-1 ${isDark ? "text-[#e0e0e0]" : "text-[#111]"}`}>
          Users
        </h2>
      </div>

      {error && <p className="text-[#e53935] text-center p-5 font-medium">{error}</p>}

      {(loading || (!error && data.length > 0)) && (
        
        <div className={`w-full overflow-x-auto rounded-lg shadow-sm border ${isDark ? "border-gray-800" : "border-gray-200"}`}>
          
          
          <table className={`w-full min-w-[700px] border-collapse text-[0.85rem] ${isDark ? "bg-[#1e1e1e] text-[#e0e0e0]" : "bg-white text-[#111]"}`}>
            
            <thead className={`${isDark ? "bg-[#2a2a2a] text-[#aaa]" : "bg-[#f8f9fa] text-[#555]"}`}>
              <tr>
                <th className="p-3 px-4 text-left font-bold uppercase tracking-wider border-b border-inherit w-[50px]">#</th>
                <th className="p-3 px-4 text-left font-bold uppercase tracking-wider border-b border-inherit w-[180px]">Name</th>
                <th className="p-3 px-4 text-left font-bold uppercase tracking-wider border-b border-inherit w-[220px]">Email</th>
                <th className="p-3 px-4 text-left font-bold uppercase tracking-wider border-b border-inherit w-[180px]">Phone</th>
                <th className="p-3 px-4 text-left font-bold uppercase tracking-wider border-b border-inherit w-[150px]">City</th>
              </tr>
            </thead>

            <tbody>
              {loading
                ? Array(5).fill(0).map((_, index) => (
                    <tr key={index}>
                      {Array(5).fill(0).map((_, i) => (
                        <td key={i} className={`p-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>
                          <div className={`h-4 w-3/4 rounded animate-pulse ${isDark ? "bg-[#333]" : "bg-[#eee]"}`}></div>
                        </td>
                      ))}
                    </tr>
                  ))
                : data.map((user) => (
                    <tr key={user.id} className={`transition-colors ${isDark ? "hover:bg-[#2a2a2a]" : "hover:bg-gray-50"}`}>
                      <td className={`p-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.id}</td>
                      <td className={`p-4 border-b font-medium ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.name}</td>
                      <td className={`p-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.email}</td>
                      <td className={`p-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.phone}</td>
                      <td className={`p-4 border-b ${isDark ? "border-[#2a2a2a]" : "border-[#f0f0f0]"}`}>{user.address.city}</td>
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