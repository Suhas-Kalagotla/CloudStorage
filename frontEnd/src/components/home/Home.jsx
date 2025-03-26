import React, { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./home.css";
import { FolderIcon, EditableField, ImageIcon } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import { PopUp, ActiveInfo, Loading } from "../";
import fileUpload from "../../utils/fileUpload";
import useFolders from "../../hooks/useFolders";
import useFiles from "../../hooks/useFiles";
import { deleteFolderApi } from "../../services/folderServices";
import { deleteFileApi } from "../../services/fileServices";

const Home = ({ user }) => {
  const folderContainerRef = useRef(null);
  const [usedStorage, setStorage] = useState(user.used_storage);
  const [popupMessage, setPopupMessage] = useState(null);
  const [isActive, setIsActive] = useState({ id: null, type: null });
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const { folderId } = useParams();

  const {
    folders,
    tempFolder,
    setTempFolder,
    createFolder,
    updateFolderName,
    fetchFolders,
    isLoading: foldersLoading,
  } = useFolders(setPopupMessage, setIsActive);

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

  const handleDelete = async (id, type) => {
    try {
      let response;
      if (type === "folder") {
        response = await deleteFolderApi(id);
        fetchFolders(folderId || user?.id);
      } else if (type === "file") {
        response = await deleteFileApi(id, folderId || user?.id);
        fetchFiles(folderId || user?.id);
      }
      setIsActive({ id: null, type: null });
      setPopupMessage(response.data.message);
    } catch (err) {
      if (err.response) {
        setPopupMessage(err.response.data.error);
      } else {
        setPopupMessage(err.message);
      }
    }
  };

  const handleUpload = () => {
    setIsActive({ id: null, type: null });
    fileInputRef.current.click();
  };

  const handleFileSelection = async (event) => {
    if (!event.target || !event.target.files) {
      setPopupMessage("No file selected");
      return;
    }
    const selectedFiles = event.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      setPopupMessage("No file selected");
      return;
    }
    const filesArray = Array.from(selectedFiles);

    try {
      await Promise.all(
        filesArray.map((file) =>
          fileUpload(
            file,
            setPopupMessage,
            fetchFiles,
            folderId,
            user.id,
            usedStorage,
            user.allocated_storage,
            setStorage,
          ),
        ),
      );
      setPopupMessage("Successfully uploaded");
    } catch (err) {
      setPopupMessage("Failed to upload one or more files");
    }
  };

  //  const handleDoubleClick = (imageUrl) => {
  //    setFullScreenImage(imageUrl);
  //  };
  //
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
            usedStorage={usedStorage}
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
            {files.map(({ name, id, imageUrl }) => (
              <div
                className={`files ${isActive.id === id ? "active" : ""}`}
                key={id}
                onClick={() => setIsActive({ id: id, type: "file" })}
              >
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
