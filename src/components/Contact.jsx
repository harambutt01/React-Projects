import "./Contact.css";


function Contact(props){
    return(
        <div className="contact-page">
            <h1>Contact Page</h1>

            <p>Email: {props.email}</p>
            <form className="contact-form">
              <input type="text" placeholder="Your Name" />
        <input type="email" placeholder="Your Email" />
        <textarea placeholder="Your Message"></textarea>
        <button type="submit">Send Message</button>
  

            </form>

        </div>
    )
}
export default Contact;