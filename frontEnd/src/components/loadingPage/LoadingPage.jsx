import React, { useEffect, useState } from "react";
import "./loadingPage.css";

const Loading = () => {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 4 ? prev + "." : ""));
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loadingContainer">
      <p> Loading{dots}</p>
    </div>
  );
};

export default Loading;
