import "./Home.css";


function Home(props) {
    return(
        <div>
            <h1>Home Page</h1>
            <p>Welcome {props.user}</p>
            <button className="home-btn">Click Me</button>

            </div>
    )
}
export default Home; 