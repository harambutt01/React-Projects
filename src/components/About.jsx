import "./About.css";


function About(props){
    return(
        <div className="about-page">
            <h1>About Page</h1>
            <p>Company Name: {props.company}</p>
            <p>We build modern React apps.</p>
            <button className="about-btn">Learn More</button>

        </div>
    )
}
export default About;