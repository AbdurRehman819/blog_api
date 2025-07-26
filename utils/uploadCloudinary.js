const cloudinary=require('../config/cloudinary');


const uploadToCloudinary = async (buffer, folder = 'posts') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      }
    );
    stream.end(buffer); // Upload buffer directly
  });
};

module.exports = uploadToCloudinary;