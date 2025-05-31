const cloudinary = require("../utils/cloudinary.js");
const uploadToCloudinary = (fileBuffer, folder = "general") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        folder,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = { uploadToCloudinary };
