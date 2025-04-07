import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./home.css";
import { FolderIcon, EditableField } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import { PopUp, ActiveInfo, Loading, ImageDisplay } from "../";
import useFolders from "../../hooks/useFolders";
import useFiles from "../../hooks/useFiles";
import { useUser } from "../../context/UserContext.jsx";

import {
  handleDelete as deleteHandler,
  handleFileSelection as fileSelectionHandler,
} from "./homeHandlers";

const Home = () => {
  const folderContainerRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const { user, updateUsedStorage } = useUser();
  const [popupMessage, setPopupMessage] = useState(null);
  const [isActive, setIsActive] = useState({ id: null, type: null });
  const [index, setIndex] = useState(null);

  const { folderId } = useParams();

  const {
    tempFolder,
    setTempFolder,
    createFolder,
    updateFolderName,
    fetchFolders,
    isLoading: foldersLoading,
  } = useFolders(folders,setFolders,setPopupMessage, setIsActive, files);

  const {
    fetchFiles,
    updateFileName,
    isLoading: filesLoading,
  } = useFiles(files, setFiles, setPopupMessage, folders);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (
        folderContainerRef.current &&
        !folderContainerRef.current.contains(event.target)
      )
        setIsActive({ id: null, type: null });
    };
    document.addEventListener("dblclick", handleClickOutSide);
    return () => {
      document.removeEventListener("dblclick", handleClickOutSide);
    };
  }, [setIsActive]);

  useEffect(() => {
    fetchFolders(folderId || user?.id);
    fetchFiles(folderId || user?.id);
    setIsActive({ id: null, type: null });
  }, [folderId]);

  const handleCreateFolder = () => {
    setTempFolder({ id: "temp_id", name: "New Folder" });
  };

  const handleDelete = (id, type) =>
    deleteHandler({
      id,
      type,
      folderId,
      user,
      setIsActive,
      setPopupMessage,
      fetchFolders,
      fetchFiles,
      updateUsedStorage,
    });

  const handleFileSelection = (event) =>
    fileSelectionHandler({
      event,
      setPopupMessage,
      fetchFiles,
      folderId,
      user,
      updateUsedStorage,
    });

  const handleUpload = () => {
    setIsActive({ id: null, type: null });
    fileInputRef.current.click();
  };

  const nameValidate = (value) => {
    if (value.length === 0) return false;
    return true;
  };

  if (filesLoading || foldersLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="homeContainer">
        <div className="homeHead">
          <StorageBar
            usedStorage={user.used_storage}
            totalStorage={user.allocated_storage}
          />
          <button onClick={handleCreateFolder}>create folder</button>
          <button onClick={handleUpload}>upload</button>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            multiple
            onChange={handleFileSelection}
          />
        </div>
        <div className="homeBody">
          <div className="folderContainer">
            {files.map(({ name, id, imageUrl }, index) => (
              <div
                className={`files ${isActive.id === id ? "active" : ""}`}
                key={id}
                onClick={() => setIsActive({ id: id, type: "file" })}
              >
                <ImageDisplay
                  name={name}
                  imageUrl={imageUrl}
                  files={files}
                  setIndex={setIndex}
                  index={index}
                />
                <EditableField
                  initialValue={name}
                  onEditingComplete={(newName) =>
                    updateFileName(id, folderId || user?.id, newName)
                  }
                  type={"text"}
                  validate={nameValidate}
                  idEditing={true}
                />
              </div>
            ))}

            {folders.map(({ id, name, parent_folder_id }) => (
              <div
                key={id}
                className={`folder ${isActive.id === id ? "active" : ""} `}
                onClick={() => setIsActive({ id: id, type: "folder" })}
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
            {isActive.id && (
              <ActiveInfo
                activeId={isActive.id}
                activeType={isActive.type}
                setIsActive={setIsActive}
                currentFolderId={folderId || user?.id}
                handleDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
      {popupMessage !== null && (
        <PopUp
          message={popupMessage}
          onClose={() => {
            setPopupMessage(null);
          }}
        />
      )}
    </>
  );
};

export default Home;
