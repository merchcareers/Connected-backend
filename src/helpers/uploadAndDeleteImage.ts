// import s3 from "../config/aws.config";
// import { PutObjectCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";
// import GenerateRandomId from "./GenerateRandomId";
// import dotenv from "dotenv";
// import { CLOUDFLARE_BUCKETNAME } from "../serviceUrl";

// dotenv.config();

// export const uploadMedia = async (files: Express.Multer.File[]): Promise<{ imageUrl: string; key: string }[]> => {
//   if (!CLOUDFLARE_BUCKETNAME) {
//     throw new Error("Please provide your bucket name.");
//   }

//   const bucketName = CLOUDFLARE_BUCKETNAME;

//   const uploadPromises = files.map((file, index) => {
//     const randomPrefix = GenerateRandomId();
//     // Generate a unique key for each file
//     const key = `${randomPrefix}-${index}`;

//     const params = {
//       Bucket: bucketName,
//       Key: key,
//       Body: file.buffer,
//       ContentType: file.mimetype,
//       ACL: "public-read" as 'public-read'
//     };

//     return s3.send(new PutObjectCommand(params))
//       .then(() => {
//         const url = `https://${bucketName}.r2.cloudflarestorage.com/${key}`;
//         return { imageUrl: url, key };
//       })
//       .catch(err => {

//         throw new Error(`Could not upload file ${file.originalname} to Cloudflare R2`);
//       });
//   });
//   try {
//     return await Promise.all(uploadPromises);
//   } catch (err) {
//     console.error('Error uploading files:', err);
//     throw new Error('Failed to upload all files. Rolling back.');
//   }

// };

// export const deleteImage = async (keys: string[]): Promise<void> => {
//   if (!CLOUDFLARE_BUCKETNAME) {
//     throw new Error("Please provide your bucket name.");
//   }
//   const bucketName = CLOUDFLARE_BUCKETNAME;
//   const objects = keys.map(key => ({ Key: key }));
//   const params = {
//     Bucket: bucketName,
//     Delete: {
//       Objects: objects,
//       Quiet: false
//     }
//   };
//   try {
//     const data = await s3.send(new DeleteObjectsCommand(params));
//     if (data.Errors && data.Errors.length > 0) {
//       throw new Error(`Failed to delete some objects: ${data.Errors.map(err => err.Key).join(", ")}`);
//     }
//     console.log("File deleted successfully");
//   } catch (error) {
//     console.error(error);
//     throw new Error("Could not delete file from Cloudflare R2");
//   }
// }

// src/helpers/uploadAndDeleteImage.ts

// import storage from "../config/firebase.config";
// import { ref, uploadBytes, deleteObject } from "firebase/storage";
// import GenerateRandomId from "./GenerateRandomId";
// import dotenv from "dotenv";

// dotenv.config();

// export const uploadMedia = async (
//   files: Express.Multer.File[]
// ): Promise<{ imageUrl: string; key: string }[]> => {
  
//   const uploadPromises = files.map(async (file, index) => {
//     const randomPrefix = GenerateRandomId();
//     const key = `${randomPrefix}-${index}`; // Preserve the original file name extension
//     const storageRef = ref(storage, key);

//     try {
//       await uploadBytes(storageRef, file.buffer, {
//         contentType: file.mimetype,
//       });
//       const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
//         process.env.FIREBASE_STORAGE_BUCKET
//       }/o/${encodeURIComponent(key)}?alt=media`;
//       return { imageUrl, key };
//     } catch (err) {
//       console.log(err)
//       throw new Error(
//         `Could not upload file ${file.originalname} to Firebase Storage: ${err}`
//       );
//     }
//   });

//   try {
//     return await Promise.all(uploadPromises);
//   } catch (err) {
//     console.error("Error uploading files:", err);
//     throw new Error("Failed to upload all files.");
//   }
// };

// export const deleteImage = async (keys: string[]): Promise<void> => {
//   const deletePromises = keys.map(async (key) => {
//     const storageRef = ref(storage, key);
//     try {
//       await deleteObject(storageRef);
//       console.log(`File deleted successfully: ${key}`);
//       return true
//     } catch (error) {
//       console.error(`Could not delete file from Firebase Storage: ${error}`);
//       throw new Error(`Could not delete file from Firebase Storage: ${error}`);
//     }
//   });

//   try {
//     await Promise.all(deletePromises);
//   } catch (error) {
//     console.error("Error deleting files:", error);
//     throw new Error("Could not delete one or more files from Firebase Storage");
//   }
// };

import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import GenerateRandomId from "./GenerateRandomId";
import { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, CLOUDINARY_CLOUD_NAME } from "../serviceUrl";
dotenv.config();

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});


export const uploadMedia = async (
  files: Express.Multer.File[]
): Promise<{ imageUrl: string; key: string }[]> => {
  const uploadPromises = files.map(async (file, index) => {
    const randomPrefix = GenerateRandomId();
    const key = `${randomPrefix}-${index}`;

    try {
      // Convert buffer to base64
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(dataURI, {
        public_id: key,
        resource_type: 'auto' // Automatically detect resource type
      });

      return {
        imageUrl: result.secure_url,
        key: result.public_id
      };
    } catch (err) {
      console.error(err);
      throw new Error(
        `Could not upload file ${file.originalname} to Cloudinary: ${err}`
      );
    }
  });

  try {
    return await Promise.all(uploadPromises);
  } catch (err) {
    console.error("Error uploading files:", err);
    throw new Error("Failed to upload all files.");
  }
};

export const deleteImage = async (keys: string[]): Promise<void> => {
  const deletePromises = keys.map(async (key) => {
    try {
      const result = await cloudinary.uploader.destroy(key);
      if (result.result === 'ok') {
        console.log(`File deleted successfully: ${key}`);
        return true;
      } else {
        throw new Error(`Deletion failed with result: ${result.result}`);
      }
    } catch (error) {
      console.error(`Could not delete file from Cloudinary: ${error}`);
      throw new Error(`Could not delete file from Cloudinary: ${error}`);
    }
  });

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error deleting files:", error);
    throw new Error("Could not delete one or more files from Cloudinary");
  }
};