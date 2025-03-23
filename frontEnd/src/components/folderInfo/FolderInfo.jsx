import React, { useEffect, useState } from "react";
import { getFolderInfo } from "../../services/folderServices";
import PopUp from "../popup/popup.js";
import "./folderInfo.css";

const FolderInfo = ({ folderId, handleDelete }) => {
  const [folder, setFolder] = useState();
  const [popupMessage, setPopupMessage] = useState(null);
  const [toDelete, setDelete] = useState(false);

  const getFolder = async () => {
    try {
      const folder = await getFolderInfo(folderId);
      setFolder(folder);
    } catch (err) {
      setPopupMessage("Failed to get folder details");
    }
  };

  useEffect(() => {
    getFolder();
  }, []);

  return (
    <>
      <div className="folderInfoContainer">
        <p> Type : {folder?.type} </p>
        <p> Size : {folder?.size} </p>
        <p>
          Create At :{" "}
          {new Date(folder?.created_at)
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
                handleDelete(folderId);
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

export default FolderInfo;
