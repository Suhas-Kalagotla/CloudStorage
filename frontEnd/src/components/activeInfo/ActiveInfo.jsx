import React, { useEffect, useState } from "react";
import { getFolderInfo } from "../../services/folderServices";
import { getFileInfo } from "../../services/fileServices";
import PopUp from "../popup/popup.js";
import "./activeInfo.css";

const ActiveInfo = ({ activeId, activeType, handleDelete }) => {
  const [data, setData] = useState();
  const [popupMessage, setPopupMessage] = useState(null);
  const [toDelete, setDelete] = useState(false);

  const getInfo = async () => {
    try {
      let folder, file;
      if (activeType === "folder") {
        folder = await getFolderInfo(activeId);
        setData(folder);
      } else if (activeType === "file") {
        file = await getFileInfo(activeId);
        setData(file);
      }
    } catch (err) {
      setPopupMessage("Failed to get folder details");
    }
  };

  useEffect(() => {
    if (activeId) {
      getInfo();
      setDelete(false);
    }
  }, [activeId]);

  return (
    <>
      <div className="folderInfoContainer">
        <p> Type : {data?.type} </p>
        <p> Size : {data?.size} </p>
        <p>
          Create At :{" "}
          {new Date(data?.created_at)
            .toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
            .replace(/\//g, "-")}
        </p>
        <button onClick={() => setDelete(true)}>Delete</button>
        {toDelete && (
          <div className="deleteContainer">
            <p> Confirm to delete this folder </p>
            <button
              onClick={() => {
                handleDelete(activeId);
                setDelete(false);
              }}
            >
              {" "}
              Yes
            </button>
            <button onClick={() => setDelete(false)}> No </button>
          </div>
        )}
      </div>
      {popupMessage !== null && (
        <PopUp message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </>
  );
};

export default ActiveInfo;
