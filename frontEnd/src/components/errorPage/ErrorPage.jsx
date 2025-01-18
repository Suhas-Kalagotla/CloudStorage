import "./errorPage.css";
import React from "react";

const ErrorPage = ({ statusCode, message }) => {
  return (
    <div className="errorContainer">
      <h1>{statusCode}</h1>
      <p>{message}</p>
    </div>
  );
};

export default ErrorPage;
