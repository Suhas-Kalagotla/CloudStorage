import "./storageBar.css";
import { useEffect, useState, useCallback } from "react";

const StorageBar = ({ usedStorage, totalStorage }) => {
  const percentage = (usedStorage / totalStorage) * 100;
  const [width, setWidth] = useState(0);
  const animation = useCallback(() => {
    let start = 0;
    const step = () => {
      if (start < percentage) {
        start += 1;
        setWidth(start);
        requestAnimationFrame(step);
      } else {
        setWidth(percentage);
      }
    };
    requestAnimationFrame(step);
  }, [percentage]);

  useEffect(() => {
    setWidth(0);
    animation();
  }, [animation]);

  return (
    <div className="storageBarContainer">
      <p> Storage used</p>
      <div className="animationBar">
        <span data-label="Memory used" style={{ width: `${width}%` }}></span>
      </div>
    </div>
  );
};

export default StorageBar;
