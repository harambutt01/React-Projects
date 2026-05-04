import { useState, useEffect } from "react";

function EffectExample() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log("Component loaded");
  }, []);

  return (
    <div>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>+</button>
    </div>
  );
}

export default EffectExample;