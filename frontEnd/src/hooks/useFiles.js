import { useState } from "react";
import { getFiles } from "../services/fileServices";
import fileReceive from "../utils/fileReceive";

const useFiles = ( setPopupMessage) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFiles = async (folderId) => {
    try {
      setIsLoading(true);
      const fileResponse = await getFiles(folderId);
      await fileReceive(setFiles, fileResponse);
    } catch (err) {
      setPopupMessage("Failed to fetch files");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchFiles,
    files,
    setPopupMessage,
    isLoading,
  };
};

export default useFiles;
