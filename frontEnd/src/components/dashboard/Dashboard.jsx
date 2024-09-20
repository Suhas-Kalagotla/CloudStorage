import { useEffect } from "react";
import axios from "axios";
import { url } from "../../utils/url";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${url}/admin/getUsers`, {
          withCredentials: true,
        });
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate("/unauthorized");
          return;
        }
        console.log(err);
      }
    };
    fetchAllUsers();
  });

  return <p>this is admin dashboard</p>;
};

export default Dashboard;
