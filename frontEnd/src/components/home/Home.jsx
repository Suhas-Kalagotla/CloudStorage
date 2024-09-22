import React from "react";
import StorageBar from "../storageBar/StorageBar.jsx";
import "./home.css";

const Home = () => {
  return (
    <div className="homeContainer">
      <StorageBar usedStorage={65} totalStorage={100} />
      <div className="homeBody">here folders are displayed</div>
    </div>
  );
};
export default Home;
