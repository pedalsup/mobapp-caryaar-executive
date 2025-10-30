import RNFS from 'react-native-fs';
import {Buffer} from 'buffer';
import {getPresignedUploadUrl, uploadFileWithFormData} from '../services';
import {Image as ImageCompressor} from 'react-native-compressor';

/**
 * Uploads a photo using multipart/form-data.
 * @param {Object} asset - The selected file asset.
 * @param {string} fileName - Name of the file.
 * @param {string} mimeType - MIME type of the file.
 * @returns {Promise<string>} - Resolves with uploaded file URL.
 */
export const uploadApplicantPhoto = (asset, fileName, mimeType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const compressedUri = await compressImage(asset?.uri);

      const formData = new FormData();

      formData.append('file', {
        uri: compressedUri,
        type: mimeType,
        name: fileName || 'filename',
      });

      const response = await uploadFileWithFormData(formData);
      const url = response?.data?.fileUrl;

      if (!url) {
        throw new Error('Upload failed: No file URL returned');
      }

      resolve(url);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Uploads a file using a pre-signed URL.
 * @param {Object} asset - The selected file asset.
 * @param {string} fileName - Name of the file.
 * @param {string} mimeType - MIME type of the file.
 * @param {string} selectionType - Prefix for file key on S3.
 * @returns {Promise<string>} - Resolves with uploaded file key.
 */
export const uploadDocumentViaPresignedUrl = (asset, selectionType) => {
  const fileName = asset.name || asset.fileName || 'upload';
  const mimeType = asset.type || 'application/octet-stream';

  return new Promise(async (resolve, reject) => {
    try {
      const uploadUrlResponse = await getPresignedUploadUrl({
        objectKey: fileName,
        prefix: selectionType,
      });

      const presignedUrl = uploadUrlResponse?.data?.url;
      const presignedKey = uploadUrlResponse?.data?.key;

      if (!presignedUrl) {
        throw new Error('Presigned URL not received');
      }

      const fileBase64 = await RNFS.readFile(asset.uri, 'base64');
      const fileBuffer = Buffer.from(fileBase64, 'base64');

      await fetch(presignedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType,
          'Content-Length': fileBuffer.length.toString(),
        },
        body: fileBuffer,
      });

      resolve(presignedKey);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Compresses an image to reduce size before upload.
 *
 * @param {string} uri - Local file URI of the image.
 * @param {object} options - Optional compression settings.
 * @returns {Promise<string>} - Returns the compressed image URI.
 */
export const compressImage = async (uri, options = {}) => {
  try {
    const compressedUri = await ImageCompressor.compress(uri, {
      compressionMethod: 'auto',
      maxWidth: 1280,
      quality: 0.7,
      ...options, // allow overrides
    });

    console.log('Image compressed successfully:', compressedUri);
    return compressedUri;
  } catch (error) {
    console.error('Image compression failed:', error);
    return uri; // fallback to original if compression fails
  }
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const validateFileSize = async uri => {
  const fileStat = await RNFS.stat(uri);
  console.log('validateFileSize', fileStat.size / (1024 * 1024));
  if (fileStat.size > MAX_FILE_SIZE) {
    return false;
  }
  return true;
};
