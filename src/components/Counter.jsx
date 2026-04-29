import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h1>{count}</h1>

      <button
        className="border border-black px-[10px] py-[4px] m-[5px] cursor-pointer text-[12px]"
        onClick={() => setCount(count + 1)}
      >
        Increase
      </button>

      <button
        className="border border-black px-[10px] py-[4px] m-[5px] cursor-pointer text-[12px]"
        onClick={() => {
          if (count > 0) setCount(count - 1);
        }}
      >
        Decrease
      </button>

      <button
        className="border border-black px-[10px] py-[4px] m-[5px] cursor-pointer text-[12px]"
        onClick={() => setCount(0)}
      >
        Reset
      </button>
    </div>
  );
}

export default Counter;