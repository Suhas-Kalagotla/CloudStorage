import { useNavigate } from "react-router-dom";
import "./navigateButton.css";

export const NavigateButton = ({ name, url }) => {
  const navigate = useNavigate();
  const handleclick = () => {
    navigate(url);
  };
  return (
    <>
      <button classname="navigatebutton" onClick={handleclick}>
        {name}
      </button>
    </>
  );
};
