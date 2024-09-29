import "./users.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../utils/url";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [updateUsers, setUpdateUsers] = useState([]);

  const handleRoleChange = (userId, newRole) => {
    const userIndex = allUsers.findIndex((user) => user.id === userId);
    if (userIndex !== -1) {
      if (!updateUsers.includes(userId))
        setUpdateUsers([...updateUsers, userId]);
      console.log(updateUsers);
      const updatedUsers = [...allUsers];
      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        role: newRole,
      };
      setAllUsers(updatedUsers);
    }
  };

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
            <th> Used Storage</th>
            <th> Allocated Storage</th>
            <th> Actions</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map((user, idx) => (
            <tr key={idx + 1}>
              <td>{idx + 1} </td>
              <td> {user.user_name} </td>
              <td> {user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="validate">Validate</option>
                </select>
              </td>
              <td> {user.used_storage}</td>
              <td> {user.allocated_storage}</td>
              <td>
                {updateUsers.includes(user.id) ? (
                  <button> Update </button>
                ) : (
                  <button className="deleteBtn"> Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
