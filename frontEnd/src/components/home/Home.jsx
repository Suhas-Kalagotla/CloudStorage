import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { url } from "../../utils/url";
import { FolderIcon, EditableField } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import "./home.css";
import PopUp from "../popup/popup.js";

const Home = ({ user }) => {
  const [animated, setAnimated] = useState(false);
  const [folders, setFolders] = useState([]);
  const [tempFolder, setTempFolder] = useState(null);
  const [popupMessage, setPopupMessage] = useState(null);
  const [activeFolderId, setActiveFolderId] = useState(null);

  const folderContainerRef = useRef(null);

  const getFolders = async () => {
    try {
      const response = await axios.get(`${url}/user/getFolders`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setFolders(response.data.folders);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const createFolderApi = async (newName) => {
    try {
      const parentId = user.id;
      const response = await axios.post(
        `${url}/user/createFolder`,
        { newName, parentId },
        {
          withCredentials: true,
        },
      );
      setActiveFolderId(response.data.folderId);
      setTempFolder(null);
      getFolders();
    } catch (err) {
      setPopupMessage("Failed to Create Folder");
      setTempFolder(null);
      console.log(err);
    }
  };

  const updateFolderNameApi = async (folderName, id) => {
    try {
      await axios.patch(
        `${url}/user/updateName`,
        { id, folderName },
        { withCredentials: true },
      );
      getFolders();
    } catch (err) {
      getFolders();
      console.log(err);
    }
  };

  const handleNameOfNewFolder = (newName) => {
    const uniqueName = generateUniqueFolderName(newName);
    console.log(uniqueName);
    createFolderApi(uniqueName);
  };

  const generateUniqueFolderName = (baseName, id = null) => {
    let name = baseName;
    let count = 1;
    let folderName;
    if (id)
      folderName = folders
        .filter((folder) => folder.id !== id)
        .map((folder) => folder.name);
    else folderName = folders.map((folder) => folder.name);

    while (folderName.includes(name)) {
      name = `${baseName} ${count}`;
      count++;
    }
    return name;
  };

  const handleCreateFolder = () => {
    let baseName = "New Folder";
    const id = "f6cfa0cb7dcff8389b4ffe234c3893d8bce7c7";
    const uniqueName = generateUniqueFolderName(baseName);
    const newFolder = {
      id: id,
      name: uniqueName,
    };
    setTempFolder(newFolder);
  };

  const updateFolderName = (id, newName) => {
    const uniqueName = generateUniqueFolderName(newName, id);

    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === id ? { ...folder, name: uniqueName } : folder,
      ),
    );
    updateFolderNameApi(uniqueName, id);
  };

  const nameValidate = (value) => {
    if (value.length === 0) return false;
    return true;
  };

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
  }, []);
  useEffect(() => {
    if (animated) setAnimated(true);
    getFolders();
  }, [animated]);

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
          <div className="folderContainer" >
            {folders.map(({ id, name }) => (
              <div
                key={id}
                className={`folder ${activeFolderId === id ? "active" : ""} `}
                onClick={() => setActiveFolderId(id)}
ref={folderContainerRef}
              >
                <FolderIcon />
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
                    handleNameOfNewFolder(newName)
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
