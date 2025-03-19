import { url } from "../utils/url";

export const getFiles = async (folderId) => {
  try {
    const response = await fetch(`${url}/user/getFiles?folderId=${folderId}`, {
      method: "GET",
      credentials: "include",
    });
    return response;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
