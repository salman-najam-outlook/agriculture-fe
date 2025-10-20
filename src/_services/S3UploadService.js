import axios from "axios";
const API_BASE_URL =
  process.env.VUE_APP_BASE_URL.replace("/admin", "") ||
  "https://sass-api-pre-prod.dimitra.dev/api";

export default {
  async singleUpload(file, folder, progressCallback = null) {
    try {
      
      const sanitizedFilename = this._sanitizeFileName(file.name);
      
      const urlData = await this.getPresignedUrl({
        name: sanitizedFilename,
        type: file.type
      }, folder);
      const { url, key } = urlData;

      await this.uploadToS3(url, file, progressCallback);

      const fullPath = await this._getAccessibleUrl(key);

      return { key, fullPath };
    } catch (error) {
      console.error("Error in singleUpload:", error);
      throw new Error("Could not upload file to S3. Please try again later.");
    }
  },

  async bolbImageUpload(file, folder) {
    try {
      const allowedTypes = ["image/png", "image/jpeg", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        throw new Error("Unsupported file type");
      }
      // Generate a filename for the blob since blobs don't have names
      let fileExtension;
      switch (file.type) {
        case "image/png":
          fileExtension = "png";
          break;
        case "image/jpeg":
          fileExtension = "jpg";
          break;
        case "image/gif":
          fileExtension = "gif";
          break;
        default:
          fileExtension = "bin";
      }

      // Create a synthetic filename for the blob
      const blobFilename = `blob-${Date.now()}.${fileExtension}`;

      // Add a name property to the blob to make it compatible with  API
      const blobWithName = new Blob([file], { type: file.type });
      blobWithName.name = blobFilename;
      const urlData = await this.getPresignedUrl(blobWithName, folder);

      const { url, key } = urlData;

      await this.uploadToS3(url, file);

      const fullPath = await this._getAccessibleUrl(key);

      return { key, fullPath };
    } catch (error) {
      console.error("Error in bolbImageUpload:", error);
      throw new Error("Could not upload image to S3. Please try again later.");
    }
  },

  async imageUpload(file, folder, progressCallback = null) {
    try {
      const sanitizedFilename = this._sanitizeFileName(file.name);
      
      const urlData = await this.getPresignedUrl({
        name: sanitizedFilename,
        type: file.type
      }, folder);
      const { url, key } = urlData;
      await this.uploadToS3(url, file, progressCallback);

      const fullPath = await this._getAccessibleUrl(key);

      return { key, fullPath };
    } catch (error) {
      console.error("Error in imageUpload:", error);
      throw new Error("Could not upload image to S3. Please try again later.");
    }
  },

  async getFileUrl(fileKey, isPublic = true) {
    return this._getAccessibleUrl(fileKey, isPublic);
  },

  async getPresignedUrl(file, folder) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/media/presigned-url`,
        {
          filename: file.name,
          mimeType: file.type,
          isPublic: true,
          directory: folder,
        },
        //salman
        // { headers: { "oauth-token": localStorage.getItem("token") } }
        //salman
      );

      return response.data.data;
    } catch (error) {
      console.error("Error getting presigned URL:", error);
      throw error;
    }
  },
  async uploadToS3(url, file, progressCallback = null) {
    await axios.put(url, file, {
      headers: { "Content-Type": file.type },
      onUploadProgress: (progressEvent) => {
        if (progressCallback) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          progressCallback(percentCompleted);
        }
      },
    });
  },
  async _getAccessibleUrl(key, isPublic = true) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/media/url`,
        { key, isPublic },
        //salman
        // { headers: { "oauth-token": localStorage.getItem("token") } }
        //salman
      );

      return response.data.data;
    } catch (error) {
      console.error("Error getting accessible URL:", error);
      throw error;
    }
  },
  _sanitizeFileName(filename) {
    if (!filename) return filename;
  
    const lastDotIndex = filename.lastIndexOf('.');
    let nameWithoutExt = filename;
    let extension = '';
  
    if (lastDotIndex !== -1) {
      nameWithoutExt = filename.substring(0, lastDotIndex);
      extension = filename.substring(lastDotIndex);
    }
    // Remove spaces, brackets, parentheses, and other special characters
    // But keep alphanumeric characters (including numbers), underscores, and hyphens
    const sanitizedName = nameWithoutExt
      .replace(/[\s[\](){}<>!@#$%^&*+=:;,?'"\\|/]+/g, '') 
      .replace(/^-+|-+$/g, '');
  
    const finalName = sanitizedName || `file_${Date.now()}`;
  
    return finalName + extension;
  }
  
};
