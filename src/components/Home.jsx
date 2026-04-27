function Home(props) {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white shadow-sm rounded-xl border border-gray-100">
      
      {/* Heading style */}
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Home Page
      </h1>

      {/* Paragraph style */}
      <p className="text-gray-600 mb-4">
        Welcome <span className="font-semibold text-blue-600">{props.user}</span>
      </p>

      <button className="px-5 py-2.5 bg-black text-white rounded font-medium cursor-pointer mt-2 hover:bg-gray-700 transition-colors duration-200">
        Click Me
      </button>

    </div>
  )
}

export default Home;