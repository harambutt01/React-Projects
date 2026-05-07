import { useState, useEffect } from "react";
function Inputwatch() {
    const[text, setText] = useState("");
    useEffect(()=>{
        console.log("Text changed:", text);
    }, [text]);
    return(
        <input value={text}onChange={(e) => setText(e.target.value)}placeholder="Type here" />
    );
}
export default Inputwatch;