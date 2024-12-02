import React, { useEffect, useState } from "react";
import { getFolderInfo } from "../../services/folderServices";
import PopUp from "../popup/popup.js";
import "./folderInfo.css";

const FolderInfo = ({ folderId }) => {
  const [folder, setFolder] = useState();
  const [popupMessage, setPopupMessage] = useState(null);

  const getFolder = async (folderId) => {
    try {
      const folder = await getFolderInfo(folderId);
      setFolder(folder);
    } catch (err) {
      setPopupMessage("Failed to get folder details");
    }
  };

  const handleDelete = () => {
    setPopupMessage("confirm to delete");
  };

  useEffect(() => {
    getFolder(folderId);
  }, [folderId]);

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
        <button onClick={() => handleDelete()}>Delete</button>
      </div>
      {popupMessage !== null && (
        <PopUp message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </>
  );
};

export default FolderInfo;
