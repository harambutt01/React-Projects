function About(props) {
  return (
    <div className="p-5 text-center mx-auto mt-20 max-w-[800px] w-[90%] flex flex-col items-center justify-center">
      
      <h1 className="text-black mb-5">
        About Page
      </h1>

      <p>Company Name: {props.company}</p>
      <p>We build modern React apps.</p>

      <button className="px-5 py-2.5 mt-[15px] bg-red-600 text-white border-0 rounded cursor-pointer transition-all duration-300 hover:bg-[#0097a7]">
        Learn More
      </button>

    </div>
  )
}

export default About;