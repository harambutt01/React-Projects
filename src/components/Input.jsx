import { useState } from "react";

function InputExample() {
  const [name, setName] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Enter name"
        onChange={(e) => setName(e.target.value)}
      />

      <h1>{name}</h1>
    </div>
  );
}

export default InputExample;