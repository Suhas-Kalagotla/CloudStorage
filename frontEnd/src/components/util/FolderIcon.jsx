import folderIcon from "../../assets/images/folder.png";

export const FolderIcon = ({ width = 48, height = 48 }) => {
  return (
    <img
      src={folderIcon}
      alt="Folder Icon"
      width={width}
      height={height}
      style={{ display: "inline-block" }}
    />
  );
};
