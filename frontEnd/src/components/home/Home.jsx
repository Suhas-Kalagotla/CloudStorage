import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { FolderIcon, EditableField } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import PopUp from "../popup/popup.js";
import useFolders from "../../hooks/useFolders";
import "./home.css";
import FolderInfo from "../folderInfo/FolderInfo";
import { useParams } from "react-router-dom";
import fileUpload from "../../utils/fileUpload";

const Home = ({ user }) => {
  const {
    folders,
    tempFolder,
    popupMessage,
    activeFolderId,
    setTempFolder,
    setActiveFolderId,
    setPopupMessage,
    createFolder,
    updateFolderName,
    fetchFolders,
  } = useFolders(user);

  const folderContainerRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  const { folderId } = useParams();

  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (
        folderContainerRef.current &&
        !folderContainerRef.current.contains(event.target)
      )
        setActiveFolderId(null);
    };
    document.addEventListener("dblclick", handleClickOutSide);
    return () => {
      document.removeEventListener("dblclick", handleClickOutSide);
    };
  }, [setActiveFolderId]);

  useEffect(() => {
    if (animated) setAnimated(true);
    fetchFolders(folderId || user?.id);
  }, [animated]);

  const handleCreateFolder = () => {
    setTempFolder({ id: "temp_id", name: "New Folder" });
  };
  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileSelection = async (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) {
      setPopupMessage("No file selected");
      return;
    }
    await fileUpload(selectedFile, setPopupMessage, fetchFolders, folderId, user.id);
  };

  const nameValidate = (value) => {
    if (value.length === 0) return false;
    return true;
  };

  return (
    <>
      <div className="homeContainer">
        <div className="homeHead">
          <StorageBar
            usedStorage={user.used_storage}
            totalStorage={user.allocated_storage}
            animated={animated}
          />
          <button onClick={handleCreateFolder}>create folder</button>
          <button onClick={handleUpload}>upload</button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileSelection}
          />
        </div>
        <div className="homeBody">
          <div className="folderContainer">
            {folders.map(({ id, name, parent_folder_id }) => (
              <div
                key={id}
                className={`folder ${activeFolderId === id ? "active" : ""} `}
                onClick={() => setActiveFolderId(id)}
                ref={folderContainerRef}
              >
                <FolderIcon folderId={id} />
                <EditableField
                  initialValue={name}
                  onEditingComplete={(newName) =>
                    updateFolderName(id, parent_folder_id, newName)
                  }
                  type={"text"}
                  validate={nameValidate}
                  idEditing={true}
                />
              </div>
            ))}
            {tempFolder && (
              <div className="tempFolder">
                <FolderIcon />
                <EditableField
                  initialValue={tempFolder.name}
                  onEditingComplete={(newName) =>
                    createFolder(folderId ?? user?.id, newName)
                  }
                  type={"text"}
                  validate={nameValidate}
                  isEditing={true}
                />
              </div>
            )}
          </div>
          <div className="folderInfo">
            {activeFolderId && <FolderInfo folderId={activeFolderId} />}
          </div>
        </div>
      </div>
      {popupMessage !== null && (
        <PopUp message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </>
  );
};

export default Home;
