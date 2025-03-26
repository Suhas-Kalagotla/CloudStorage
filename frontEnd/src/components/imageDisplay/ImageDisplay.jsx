import React, { useState, useEffect } from "react";
import pdfIcon from "../../assets/images/pdf.jpg";
import excelIcon from "../../assets/images/excel.jpg";
import closeIcon from "../../assets/images/close.svg";
import downloadIcon from "../../assets/images/download.svg";
import leftIcon from "../../assets/images/left.svg";
import rightIcon from "../../assets/images/right.svg";
import { motion, AnimatePresence } from "framer-motion";
import "./imageDisplay.css";

const ImageDisplay = ({ name, imageUrl, files, setIndex, index }) => {
  const [currentIndex, setCurIndex] = useState(index);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const getFileExtension = (fileName) => {
    return fileName.split(".").pop().toLowerCase();
  };
  const handleDoubleClick = (imageUrl) => {
    setFullScreenImage(imageUrl);
    setIndex(index);
    setCurIndex(index);
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imageUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrev = () => {
    setCurIndex((prev) => (prev === 0 ? files.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurIndex((prev) => (prev === files.length - 1 ? 0 : prev + 1));
  };

  const fileExtension = getFileExtension(name);
  const isPdf = fileExtension === "pdf";
  const isExcel = ["xls", "xlsx"].includes(fileExtension);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "Escape") setFullScreenImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, setFullScreenImage]);

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
            <div className="iconBox" onClick={handleDownload}>
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
          <div className="leftCtn" onClick={handlePrev}>
            <div className="iconBox leftIcon">
              <img src={leftIcon} alt="Move Left" className="icon" />
            </div>
          </div>
          <div id="imageCtn">
            <AnimatePresence mode="wait">
              <motion.img
                key={files[currentIndex].imageUrl}
                src={files[currentIndex].imageUrl}
                alt="Full screen img"
                className="image"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              />
            </AnimatePresence>
          </div>
          <div className="rightCtn" onClick={handleNext}>
            <div className="iconBox rightIcon">
              <img src={rightIcon} alt="Move Right" className="icon" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ImageDisplay;
