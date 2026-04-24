import React from 'react'

const TailwindTest = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      {/* Ek Pyara sa Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl overflow-hidden transform transition hover:scale-105 duration-300">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
          <h2 className="text-white text-2xl font-bold">Tailwind Practice 🚀</h2>
          <p className="text-blue-100 text-sm">Testing my new skills</p>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-gray-600">
            Ye component bilkul alag hai. Yahan main jo marzi design karun, 
            mere purane Dashboard par koi asar nahi parega!
          </p>
          
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">Active</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Learning</span>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 active:bg-blue-800 transition shadow-lg shadow-blue-200">
            Try Hovering Me!
          </button>
        </div>
      </div>
    </div>
  )
}

export default TailwindTest