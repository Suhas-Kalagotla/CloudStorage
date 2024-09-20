import { useEffect, useState } from "react";
import axios from "axios";
import { url } from "../../utils/url";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${url}/admin/getUsers`, {
          withCredentials: true,
        });
        setUsers(response.data.result);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/unauthorized");
          return;
        }
        if (err.response && err.response.status === 403) {
          navigate("/forbidden");
          return;
        }
        console.log(err);
      }
    };
    fetchAllUsers();
  }, [navigate]);

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
