import React from "react";
import pdfIcon from "../../assets/images/pdf.jpg";
import excelIcon from "../../assets/images/excel.jpg";

export const ImageIcon = ({ name, imageUrl }) => {
  const getFileExtension = (fileName) => {
    return fileName.split(".").pop().toLowerCase();
  };

  const fileExtension = getFileExtension(name);
  const isPdf = fileExtension === "pdf";
  const isExcel = ["xls", "xlsx"].includes(fileExtension);

  return (
    <img
      src={isPdf ? pdfIcon : isExcel ? excelIcon : imageUrl}
      alt={name}
      className="img"
    />
  );
};
