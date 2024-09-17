import { useEffect } from "react";
import axios from "axios";
import { url } from "../../utils/url";

const Dashboard = () => {
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`${url}/admin/getUsers`);
        console.log("something");
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllUsers();
  }, []);

  return <p>this is admin dashboard</p>;
};

export default Dashboard;
