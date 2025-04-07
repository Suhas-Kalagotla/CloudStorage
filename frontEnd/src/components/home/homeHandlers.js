import fileUpload from "../../utils/fileUpload";
import { deleteFolderApi } from "../../services/folderServices";
import { deleteFileApi } from "../../services/fileServices";

export const handleDelete = async ({
  id,
  type,
  folderId,
  user,
  setIsActive,
  setPopupMessage,
  fetchFolders,
  fetchFiles,
  updateUsedStorage,
}) => {
  try {
    let response;

    if (type === "folder") {
      response = await deleteFolderApi(id);
      fetchFolders(folderId || user?.id);
    } else if (type === "file") {
      response = await deleteFileApi(id, folderId || user?.id);
      updateUsedStorage(response.data.userSize);
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

export const handleFileSelection = async ({
  event,
  setPopupMessage,
  fetchFiles,
  folderId,
  user,
  updateUsedStorage,
}) => {
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
          user.used_storage,
          user.allocated_storage,
          updateUsedStorage,
        ),
      ),
    );
    setPopupMessage("Successfully uploaded");
  } catch (err) {
    setPopupMessage("Failed to upload one or more files");
  }
};


