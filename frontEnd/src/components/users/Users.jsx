import "./users.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../utils/url";
import { useNavigate } from "react-router-dom";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [updateUsers, setUpdateUsers] = useState({});

  const handleUpdate = async (id, role, allocatedStorage) => {
    try {
      const response = await axios.patch(
        `${url}/admin/updateUser`,
        { role, allocatedStorage, id },
        { withCredentials: true },
      );
      if (response.status === 200) {
        removeUserFromUpdate(id);
        fetchAllUsers();
      }
    } catch (err) {
      console.log(err);
    }
  };

  const removeUserFromUpdate = (userId) => {
    setUpdateUsers((prevUpdates) => {
      const { [userId]: removedUser, ...remainingUpdates } = prevUpdates;
      return remainingUpdates;
    });
  };

  const addUserToUpdate = (userId, newRole, allocatedStorage) => {
    setUpdateUsers((prevChanges) => ({
      ...prevChanges,
      [userId]: {
        ...prevChanges[userId],
        role: newRole,
        allocatedStorage: allocatedStorage,
      },
    }));
  };

  const handleRoleChange = async (userId, newRole) => {
    const originalRole = allUsers.find((user) => user.id === userId)?.role;

    if (newRole === originalRole) {
      if (updateUsers[userId]) {
        removeUserFromUpdate(userId);
      }
    } else {
      addUserToUpdate(userId, newRole);
    }
  };

  const navigate = useNavigate();

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

  useEffect(() => {
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
                  defaultValue={user.role}
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
                {updateUsers[user.id] ? (
                  <button
                    onClick={() =>
                      handleUpdate(
                        user.id,
                        updateUsers[user.id].role || user.role,
                        updateUsers[user.id].allocated_storage ||
                          user.allocated_storage,
                      )
                    }
                    className="updateBtn"
                  >
                    Update
                  </button>
                ) : (
                  <button> Access</button>
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
