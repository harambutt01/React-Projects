import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    
    <div className="pt-24 px-5 text-center max-w-md mx-auto">
      <h1 className="text-4xl font-bold mb-6">{count}</h1>

      <div className="flex justify-center gap-2">
        <button
          className="border border-black px-[10px] py-[4px] cursor-pointer text-[12px] hover:bg-black hover:text-white transition-colors"
          onClick={() => setCount(count + 1)}
        >
          Increase
        </button>

        <button
          className="border border-black px-[10px] py-[4px] cursor-pointer text-[12px] hover:bg-black hover:text-white transition-colors"
          onClick={() => {
            if (count > 0) setCount(count - 1);
          }}
        >
          Decrease
        </button>

        <button
          className="border border-black px-[10px] py-[4px] cursor-pointer text-[12px] hover:bg-black hover:text-white transition-colors"
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Counter;