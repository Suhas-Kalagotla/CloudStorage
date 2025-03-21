import React from "react";
import {useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <p>this is admin dashboard</p>
      {/*
      {users.length > 0 &&
        users.map((user, index) => (
          <p key={user.id}>
            {index + 1} - {user.userName}
          </p>
        ))}
*/}
    </div>
  );
};

export default Dashboard;
