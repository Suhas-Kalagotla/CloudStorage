import "./users.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../utils/url";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${url}/admin/getUsers`, {
          withCredentials: true,
        });
        setAllUsers(response.data.result);
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
    <div className="usersContainer">
        <table>
          <thead>
            <tr>
              <th>ID </th>
              <th> User Name</th>
              <th> Email </th>
              <th> Role </th>
            </tr>
          </thead>
          <tbody>
            {allUsers.map((user, idx) => (
              <tr key={idx + 1}>
                <td>{idx + 1} </td>
                <td> {user.userName} </td>
                <td> {user.email}</td>
                <td> {user.role} </td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  );
};

export default Users;
