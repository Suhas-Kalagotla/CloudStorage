import folderIcon from "../../assets/images/folder.png";
import { useNavigate } from "react-router-dom";

export const FolderIcon = ({ width = 48, height = 48, folderId = null }) => {
  const navigate = useNavigate();

  const handleDoubleClick = () => {
    if (folderId) navigate(`/folders/${folderId}`);
  };

  return (
    <img
      src={folderIcon}
      alt="Folder Icon"
      width={width}
      height={height}
      style={{ display: "inline-block" }}
      onDoubleClick={handleDoubleClick}
    />
  );
};
