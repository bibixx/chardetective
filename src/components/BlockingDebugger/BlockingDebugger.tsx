import { useEffect, useState } from "react";

export const BlockingDebugger = () => {
  const [value, setValue] = useState(String(Math.random().toFixed(20)).replace(".", ""));

  useEffect(() => {
    const int = setInterval(() => {
      setValue(String(Math.random().toFixed(20)).replace(".", ""));
    }, 50);

    return () => clearInterval(int);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        background: "white",
        color: "black",
        fontFamily: "var(--font-mono)",
      }}
    >
      {value}
    </div>
  );
};
