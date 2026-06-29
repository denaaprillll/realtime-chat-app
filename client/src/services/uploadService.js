export const uploadImage = async (selectedImage) => {
  if (!selectedImage) return null;

  const formData = new FormData();
  formData.append("image", selectedImage);

  try {
    const response = await fetch("http://localhost:3000/upload", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result.image;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const uploadFile = async (selectedFile) => {
  if (!selectedFile) return null;

  const formData = new FormData();
  formData.append("file", selectedFile);

  try {
    const response = await fetch("http://localhost:3000/upload-file", {
      method: "POST",
      body: formData,
    });

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};