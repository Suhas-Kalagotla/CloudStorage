import React, { useState, useEffect } from "react";

import { FolderIcon, EditableField } from "../util";
import StorageBar from "../storageBar/StorageBar.jsx";
import "./home.css";

const Home = () => {
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

  useEffect(() => {
    if (!animated) setAnimated(true);
  }, [animated]);

  return (
    <div className="homeContainer">
      <div className="homeHead">
        <StorageBar usedStorage={65} totalStorage={100} animated={animated} />
      </div>
      <div className="homeBody">
        <div className="folderContainer">
          {folders.map(({ id, name, editing }) => (
            <div key={id} className="folder">
              <FolderIcon />
              <EditableField
                onEditingComplete={(newName) => updateFolderName(id, newName)}
                text={name}
                editing={editing}
              />
            </div>
          ))}
        </div>
        <div className="folderDataContainer"></div>
      </div>
    </div>
  );
};

export default Home;
