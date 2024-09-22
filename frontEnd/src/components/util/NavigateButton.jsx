import { useNavigate } from "react-router-dom";
import "./navigateButton.css";

export const NavigateButton = ({ name, url, active = false }) => {
  const navigate = useNavigate();
  const handleclick = () => {
    navigate(url);
  };
  return (
    <>
      <button
        className={`${active ? "activeNavButton navigateButton" : "navigateButton"}`}
        onClick={handleclick}
      >
        {name}
        {active}
      </button>
    </>
  );
};
