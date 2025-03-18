const fileReceive = async (files, setFiles, response) => {
  try {
    const reader = response.body.getReader();
    let receivedBase64 = "";
    let currentFileName = "";
    let fileType = "image/png";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const textChunk = new TextDecoder().decode(value);
      const lines = textChunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("{")) {
          const fileData = JSON.parse(line);
          currentFileName = fileData.name;
          fileType = fileData.type || "image/png";
          receivedBase64 = "";
        } else if (line === "---END-FILE---") {
          const base64String = `data:${fileType};base64,${receivedBase64}`;
          setFiles((prevFiles) => {
            if (!prevFiles.some((file) => file.name === currentFileName)) {
              return [
                ...prevFiles,
                { name: currentFileName, url: base64String },
              ];
            }
            return prevFiles;
          });
        } else {
          receivedBase64 += line;
        }
      }
    }
  } catch (err) {
    console.log("error fetching files:", err);
  }
};

export default fileReceive;
