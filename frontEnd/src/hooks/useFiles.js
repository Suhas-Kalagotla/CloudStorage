import { useState } from "react";
import { getFiles } from "../services/fileServices";
import fileReceive from "../utils/fileReceive";

const useFiles = (user, setPopupMessage) => {
  const [files, setFiles] = useState([]);

  const fetchFiles = async (folderId) => {
    try {
      const fileResponse = await getFiles(folderId);
      await fileReceive(files, setFiles, fileResponse);
    } catch (err) {
      setPopupMessage("Failed to fetch files");
    }
  };

  return {
    fetchFiles,
    files,
    setPopupMessage,
  };
};

export default useFiles;
