import cryptojs from "crypto-js";

const handleFileSelection = async (event) => {
  const file = event.target.files[0];
  setFile(file);
  if (!file) {
    setPopupMessage("No file selected");
    return;
  }
  const reader = new FileReader();
  reader.onload = async (e) => {
    const fileData = e.target.result;
    const secretKey = "veryhardkey1234";
    const encryptedFile = CryptoJS.AES.encrypt(fileData, secretKey).toString();

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([encryptedFile], { type: "application/octet-stream" }),
      file.name,
    );

    try {
      const response = await axios.post(`${url}/user/fileUpload`, formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setPopupMessage("Successfully uploaded");
        fetchFolders(folderId || user?.id);
      }
    } catch (err) {
      console.log(err);
    }
  };
  reader.readAsBinaryString(file);
};

export default handleFileSelection;
