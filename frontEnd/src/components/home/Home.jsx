import React, { useRef, useState, useEffect } from "react";
import { FolderIcon, EditableField } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import PopUp from "../popup/popup.js";
import useFolders from "../../hooks/useFolders";
import "./home.css";

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

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (
        folderContainerRef.current &&
        !folderContainerRef.current.contains(event.target)
      )
        setActiveFolderId(null);
    };
    document.addEventListener("mousedown", handleClickOutSide);
    return () => {
      document.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [setActiveFolderId]);

  useEffect(() => {
    if (animated) setAnimated(true);
    fetchFolders(user?.id);
  }, [animated]);

  const handleCreateFolder = () => {
    setTempFolder({ id: "temp_id", name: "New Folder" });
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
            usedStorage={user?.used_storage}
            totalStorage={user?.allocated_storage}
            animated={animated}
          />
          <button onClick={handleCreateFolder}>create folder</button>
        </div>
        <div className="homeBody">
          <div className="folderContainer">
            {folders.map(({ id, name }) => (
              <div
                key={id}
                className={`folder ${activeFolderId === id ? "active" : ""} `}
                onClick={() => setActiveFolderId(id)}
                ref={folderContainerRef}
              >
                <FolderIcon folderId={id} />
                <EditableField
                  initialValue={name}
                  onEditingComplete={(newName) => updateFolderName(id, newName)}
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
                    createFolder(user?.id, newName)
                  }
                  type={"text"}
                  validate={nameValidate}
                  isEditing={true}
                />
              </div>
            )}
          </div>
          <div className="folderDataContainer"></div>
        </div>
      </div>
      {popupMessage !== null && (
        <PopUp message={popupMessage} onClose={() => setPopupMessage(null)} />
      )}
    </>
  );
};

export default Home;
