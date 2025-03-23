import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./home.css";
import { FolderIcon, EditableField, ImageIcon } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import { PopUp, FolderInfo, Loading } from "../";
import fileUpload from "../../utils/fileUpload";
import useFolders from "../../hooks/useFolders";
import useFiles from "../../hooks/useFiles";
import { deleteFolderApi } from "../../services/folderServices";

const Home = ({ user }) => {
  const folderContainerRef = useRef(null);
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
    isLoading: foldersLoading,
  } = useFolders(setPopupMessage);

  const {
    files,
    fetchFiles,
    isLoading: filesLoading,
  } = useFiles(user, setPopupMessage);

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
    fetchFolders(folderId || user?.id);
    fetchFiles(folderId || user?.id);
    setActiveFolderId(null);
  }, [folderId]);

  const handleCreateFolder = () => {
    setTempFolder({ id: "temp_id", name: "New Folder" });
  };

  const handleDelete = async (deleteFolderId) => {
    try {
      const response = await deleteFolderApi(deleteFolderId);
      setPopupMessage(response.data.message);
      setActiveFolderId(null);
      fetchFolders(folderId || user?.id);
    } catch (err) {
      if (err.response) {
        setPopupMessage(err.response.data.error);
      } else {
        setPopupMessage(err.message);
      }
    }
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

  if (filesLoading | foldersLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="homeContainer">
        <div className="homeHead">
          <StorageBar
            usedStorage={usedStorage}
            totalStorage={user.allocated_storage}
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
            {activeFolderId && (
              <FolderInfo
                folderId={activeFolderId}
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
