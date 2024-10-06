import React, { useState, useEffect } from "react";

import { FolderIcon, EditableField } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import "./home.css";

const Home = ({ user }) => {
  const [animated, setAnimated] = useState(false);
  const [folders, setFolders] = useState([
    { id: 1, name: "folder 1" },
    { id: 2, name: "folder 2" },
  ]);

  const updateFolderName = (id, newName) => {
    setFolders((prevFolders) =>
      prevFolders.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder,
      ),
    );
  };

  const nameValidate = (value) => {
    if (value.length === 0) return false;
    return true;
  };

  useEffect(() => {
    if (animated) setAnimated(true);
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
        </div>
        <div className="homeBody">
          <div className="folderContainer">
            {folders.map(({ id, name }) => (
              <div key={id} className="folder">
                <FolderIcon />
                <EditableField
                  initialValue={name}
                  onEditingComplete={(newName) => updateFolderName(id, newName)}
                  text={name}
                  validate={nameValidate}
                />
              </div>
            ))}
          </div>
          <div className="folderDataContainer"></div>
        </div>
      </div>
    </>
  );
};

export default Home;
