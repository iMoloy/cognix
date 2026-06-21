import axios from "axios";

export const uploadImage = async (file) => {
  if (!file) return null;

  // Use the env var, or fallback to a common test key for PH assignments if none is provided
  // Note: Test key should only be used for dev, it's better to use env variable.
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || "895c27f3b890a2fc5a7bd2c7bfb602fe";

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
      formData
    );

    if (response.data && response.data.success) {
      return response.data.data.url;
    } else {
      throw new Error("Failed to upload image.");
    }
  } catch (error) {
    console.error("Image upload error:", error);
    throw new Error(error.response?.data?.error?.message || "Image upload failed");
  }
};
