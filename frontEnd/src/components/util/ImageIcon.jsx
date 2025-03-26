import React, { useState } from "react";
import pdfIcon from "../../assets/images/pdf.jpg";
import excelIcon from "../../assets/images/excel.jpg";
import closeIcon from "../../assets/images/close.svg";
import downloadIcon from "../../assets/images/download.svg";
import leftIcon from "../../assets/images/left.svg";
import rightIcon from "../../assets/images/right.svg";
import "./imageIcon.css";

export const ImageIcon = ({ name, imageUrl }) => {
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const getFileExtension = (fileName) => {
    return fileName.split(".").pop().toLowerCase();
  };
  const handleDoubleClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
  };

  const fileExtension = getFileExtension(name);
  const isPdf = fileExtension === "pdf";
  const isExcel = ["xls", "xlsx"].includes(fileExtension);

  return (
    <>
      <img
        src={isPdf ? pdfIcon : isExcel ? excelIcon : imageUrl}
        alt={name}
        className="img"
        onDoubleClick={handleDoubleClick}
      />
      {fullScreenImage && (
        <div className="imageOverlay">
          <div className="topIcons">
            <div className="iconBox">
              <img src={downloadIcon} alt="Download Button" className="icon" />
            </div>
            <div className="iconBox">
              <img
                src={closeIcon}
                alt="Close Button"
                onClick={() => setFullScreenImage(null)}
                className="icon"
              />
            </div>
          </div>

          <div className="leftCtn">
            <div className="iconBox leftIcon">
              <img src={leftIcon} alt="Move Left" className="icon" />
            </div>
          </div>

          <div id="imageCtn">
            <img src={imageUrl} alt="Full Screen" className="image" />
          </div>

          <div className="rightCtn">
            <div className="iconBox rightIcon">
              <img src={rightIcon} alt="Move Right" className="icon" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
