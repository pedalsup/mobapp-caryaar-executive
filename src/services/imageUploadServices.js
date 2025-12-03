import axiosInstance from '../networking/axiosInstance';
import axios from 'axios';
import {endpoints} from './endpoints';

/**
 * Fetches a presigned upload URL for uploading a file.
 *
 * @async
 * @function getPresignedUploadUrl
 * @param {Object} payload - The payload to request the upload URL (e.g., { fileName: 'test.jpg', fileType: 'image/jpeg' }).
 * @returns {Promise<string>} A promise that resolves to the presigned upload URL.
 * @throws {Error} If the API call fails.
 */
export const getPresignedUploadUrl = async payload => {
  try {
    const response = await axiosInstance.post(
      endpoints.UPLOAD.PRESIGNED_UPLOAD,
      payload,
    );
    return response.data; // usually includes `url` and maybe `key`
  } catch (error) {
    throw error;
  }
};

/**
 * Fetches a presigned download URL for a file.
 *
 * @async
 * @function getPresignedDownloadUrl
 * @param {Object} payload - The payload to request the download URL (e.g., { key: 'path/to/file.jpg' }).
 * @returns {Promise<string>} A promise that resolves to the presigned download URL.
 * @throws {Error} If the API call fails.
 */
export const getPresignedDownloadUrl = async payload => {
  try {
    const response = await axiosInstance.post(
      endpoints.UPLOAD.PRESIGNED_DOWNLOAD,
      payload,
    );
    return response.data; // usually includes `url`
  } catch (error) {
    throw error;
  }
};

/**
 * Uploads a file to a presigned S3 URL.
 *
 * @async
 * @function uploadFileToPresignedUrl
 * @param {string} presignedUrl - The presigned PUT URL.
 * @param {File|Blob} file - The file or blob to upload.
 * @param {string} [contentType='application/octet-stream'] - The MIME type of the file.
 * @returns {Promise<void>} A promise that resolves when the upload is complete.
 * @throws {Error} If the PUT request fails.
 */
export const uploadFileToPresignedUrl = async (
  presignedUrl,
  file,
  contentType = 'application/octet-stream',
) => {
  try {
    await axios.put(presignedUrl, file, {
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    throw error;
  }
};

export const uploadFileWithFormData = async formData => {
  try {
    const response = await axiosInstance.post(
      endpoints.UPLOAD.FORM_UPLOAD,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(
      'uploadFileWithFormData_response',
      JSON.stringify(error?.response),
    );
    throw error;
  }
};
