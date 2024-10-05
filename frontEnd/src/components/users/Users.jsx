import "./users.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../utils/url";
import { useNavigate } from "react-router-dom";
import { EditableField } from "../util/EditableField";

const Users = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [updateUsers, setUpdateUsers] = useState({});

  const navigate = useNavigate();

  const fetchAllUsers = async () => {
    try {
      const response = await axios.get(`${url}/admin/getUsers`, {
        withCredentials: true,
      });
      setAllUsers(response.data.result);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401) {
        navigate("/unauthorized");
      } else if (status === 403) {
        navigate("/forbidden");
      } else {
        console.log(err);
      }
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleUpdate = async (id, role, allocatedStorage) => {
    try {
      const response = await axios.patch(
        `${url}/admin/updateUser`,
        { id, role, allocatedStorage },
        { withCredentials: true },
      );
      if (response.status === 200) {
        removeUserFromUpdate(id);
        fetchAllUsers();
      }
    } catch (err) {
      if (err.status === 501) console.log(err.response.data.error);
      console.log(err);
    }
  };

  const handleCreateFolder = async (userName) => {
    try {
      const response = await axios.post(
        `${url}/admin/createFolder`,
        { userName },
        { withCredentials: true },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const addUserToUpdate = (userId, role, allocated_storage) => {
    setUpdateUsers((prev) => ({
      ...prev,
      [userId]: { role, allocated_storage },
    }));
  };

  const removeUserFromUpdate = (userId) => {
    setUpdateUsers((prev) => {
      const { [userId]: _, ...remainingUsers } = prev;
      return remainingUsers;
    });
  };

  const validateAllocatedStorage = (value) => {
    const num = Number(value);
    if (isNaN(num)) return false;
    if (num < 0) return false;
    return true;
  };

  const handleUserChange = async (userId, newRole, allocatedStorage) => {
    const user = allUsers.find((user) => user.id === userId);

    if (newRole === user.role && allocatedStorage === user.allocated_storage) {
      removeUserFromUpdate(userId);
    } else {
      addUserToUpdate(userId, newRole, allocatedStorage);
    }
  };

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
                  onChange={(e) =>
                    handleUserChange(
                      user.id,
                      e.target.value,
                      updateUsers[user.id]?.allocated_storage ||
                        user.allocated_storage,
                    )
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="validate">Validate</option>
                </select>
              </td>
              <td> {user.used_storage}</td>
              <td>
                <EditableField
                  type="text"
                  initialValue={user.allocated_storage}
                  onEditingComplete={(newValue) => {
                    handleUserChange(
                      user.id,
                      updateUsers[user.id]?.role || user.role,
                      Number(newValue),
                    );
                  }}
                  validate={validateAllocatedStorage}
                />
              </td>
              <td>
                {updateUsers[user.id] ? (
                  <button
                    onClick={() =>
                      handleUpdate(
                        user.id,
                        updateUsers[user.id].role,
                        updateUsers[user.id].allocated_storage,
                      )
                    }
                    className="updateBtn"
                  >
                    Update
                  </button>
                ) : user.allocated_storage === 0 ? (
                  <button onClick={() => handleCreateFolder(user.id)}>
                    Create
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
