import React, { useRef, useState, useEffect } from "react";
import { FolderIcon, EditableField } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import PopUp from "../popup/popup.js";
import useFolders from "../../hooks/useFolders";
import "./home.css";
import FolderInfo from "../folderInfo/FolderInfo";
import { useParams } from "react-router-dom";
import fileUpload from "../../utils/fileUpload";
import useFiles from "../../hooks/useFiles";
import { ImageIcon } from "../util/ImageIcon";

const Home = ({ user }) => {
  const folderContainerRef = useRef(null);
  const [animated, setAnimated] = useState(false);
  const [usedStorage, setStorage] = useState(user.used_storage);
  const [popupMessage, setPopupMessage] = useState(null);
  const { folderId } = useParams();

  const {
    folders,
    tempFolder,
    activeFolderId,
    setTempFolder,
    setActiveFolderId,
    createFolder,
    updateFolderName,
    fetchFolders,
  } = useFolders(user, setPopupMessage);

  const { files, fetchFiles } = useFiles(user, setPopupMessage);

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
    fetchFiles(folderId || user?.id);
    setActiveFolderId(null);
  }, [animated, folderId]);

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
    await fileUpload(
      selectedFile,
      setPopupMessage,
      fetchFolders,
      folderId,
      user.id,
      usedStorage,
      user.allocated_storage,
      setStorage,
    );
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
            usedStorage={usedStorage}
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
            {files.map(({ name, id, imageUrl }) => (
              <div className="files" key={id}>
                <ImageIcon name={name} imageUrl={imageUrl} />
                <EditableField
                  initialValue={name}
                  type={"text"}
                  validate={nameValidate}
                  idEditing={true}
                />
              </div>
            ))}

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
