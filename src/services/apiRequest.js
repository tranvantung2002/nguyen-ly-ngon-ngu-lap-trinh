import request from "../config/axiosConfig";

export const getBooks = async (dataParam) => {
  const result = await request({
    url: "get-books",
    method: "POST",
    data: dataParam
  });
  return result?.data;
}

export const addBook = async (data) => {
  const result = await request({
    url: "add-book",
    method: "POST",
    data: data
  });
  return result?.data;
};


export const editBookok = async (data) => {
  const result = await request({
    url: "edit-book",
    method: "POST",
    data: data
  });
  return result?.data;
};


export const removeBook = async (data) => {
  const result = await request({
    url: "remove-book",
    method: "POST",
    data: data
  });
  return result?.data;
};