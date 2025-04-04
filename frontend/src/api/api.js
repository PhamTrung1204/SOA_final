import { AUTH_URL } from "./API_URL";
import axios from "./myAxios";

//----------------------------- General -----------------------------
export async function createRecord(url, data) {
  try {
    const newData = (await axios.post(url, data)).data;

    if (!newData) throw Error;

    return newData;
  } catch (error) {
    console.error(error);
    return data;
  }
}

export async function readAll(url) {
  try {
    const data = (await axios.get(url)).data;
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function updateRecord(url, data) {
  try {
    const newData = (await axios.patch(url, data)).data;

    if (!newData) throw Error(newData);

    return newData;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteRecord(url) {
  try {
    const data = (await axios.delete(url)).data;
    if (data) return data;
    throw Error;
  } catch (error) {
    console.error(error);
  }
}

export async function search(url, searchParam) {
  try {
    const data = (await axios.get(url, { params: searchParam })).data;
    if (data) return data;
    throw Error;
  } catch (error) {
    console.error(error);
  }
}

//----------------------------- Auth -----------------------------

export async function login(loginInfo) {
  try {
    const token = (await axios.post(AUTH_URL.login, loginInfo)).data;

    if (!token) throw Error;

    return token;
  } catch (error) {
    console.error(error);
  }
}

export async function getCurrentUser() {
  try {
    const user = (await axios.get(AUTH_URL.getCurrentUser)).data;

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.error(error);
  }
}

// export async function readAll(readType, id) {
//   try {
//     console.log(READ_ALL_URL(id)[readType]);

//     const data = (await axios.get(READ_ALL_URL(id)[readType])).data;
//     return data;
//   } catch (error) {
//     console.error(error);
//     return error;
//   }
// }

//----------------------------- Account -----------------------------
export async function createAccount(user) {
  try {
    const data = (await axios.post("/auth/register", user)).data;
    if (!data) throw Error;

    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
}

export async function updateAccountStatus(user) {
  try {
    const status = (
      await axios.patch(
        `/account/Quan-ly-tai-khoan/${user.accountCode}/Chinh-sua-trang-thai-tai-khoan`,
        user
      )
    ).status;
    if (status) return status;
    throw Error;
  } catch (error) {
    console.error(error);
    return error;
  }
}

//----------------------------- PRODUCT -----------------------------

export async function createProduct(url, data) {
  const formData = new FormData();

  // Basic fields
  formData.append("productCode", data.productCode);
  formData.append("productName", data.productName);
  formData.append("description", data.description || "Default description");
  formData.append("productStatus", data.productStatus || "Available");
  formData.append("category", data.category);
  formData.append("brand", data.brand);

  // JSON fields (tag, relativeProduct, specs, category, and brand)
  formData.append("tag", JSON.stringify(data.tag || []));
  formData.append("variations", JSON.stringify(data.variations));

  // Image or file handling
  if (data.files) {
    for (let i = 0; i < data.files.length; i++) {
      formData.append("files", data.files[i]);
    }
  }

  try {
    const response = await axios.post(url, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}
export async function updateProduct(url, data) {
  const formData = new FormData();
  console.log(data);


  // Basic fields
  formData.append("productCode", data.productCode);
  formData.append("productName", data.productName);
  formData.append("description", data.description || "Default description");
  formData.append("productStatus", data.productStatus || "Draft");
  formData.append("category", data.category);
  formData.append("brand", data.brand);

  // JSON fields (tag, relativeProduct, specs, category, and brand)
  formData.append("imageUrls", JSON.stringify(data.imageUrls || []));
  formData.append("tag", JSON.stringify(data.tag || []));
  formData.append("variations", JSON.stringify(data.variations));

  // Image or file handling
  if (data.files) {
    for (let i = 0; i < data.files.length; i++) {
      formData.append("files", data.files[i]);
    }
  }


  try {
    const response = await axios.patch(url, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
  }
}
//----------------------------- SLIDER_BANNER -----------------------------

export async function manageCarousel(url, data) {
  const formData = new FormData();

  // Basic fields
  formData.append("title", data.title);
  formData.append("slug", data.slug);
  formData.append("files", data.imgUrl);

  try {
    const response = data.isNew ? await axios.post(url, formData) : await axios.patch(url, formData);
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
}
