import { useEffect, useRef } from "react";
import "./popup.css";

function PopUp({ message, onClose }) {
  const popupRef = useRef();
  useEffect(() => {
    function handleClickOutSide(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [onClose]);
  return (
    <div className="popupOverlay">
      <div className="popupContent" ref={popupRef}>
        <p> {message}</p>
        <button onClick={onClose}>Ok</button>
      </div>
    </div>
  );
}

export default PopUp;
