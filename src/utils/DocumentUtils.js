import {pick, types} from '@react-native-documents/picker';
import {Alert, Linking} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import RNFS from 'react-native-fs';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {
  documentImageLabelMap,
  documentImageType,
  documentType,
  occupationType,
  partnerDocumentLabelMap,
} from '../constants/enums';
import {getPresignedDownloadUrl} from '../services';
import {showToast} from './helper';
import {compressImage} from './fileUploadUtils';
import {loan_document_requirements} from '../constants/loan_document_requirements';

/**
 * Launches a file picker based on type: camera, gallery, or document.
 *
 * @param {'camera' | 'gallery' | 'document'} type - Picker type.
 * @param {(file: object | null) => void} callback - Callback with selected file or null.
 */
// export const handleFileSelection = async (type, callback) => {
//   try {
//     if (type === 'camera') {
//       const result = await launchCamera({
//         mediaType: 'photo',
//         quality: 0.5,
//         saveToPhotos: true,
//         conversionQuality: 0.9,
//       });

//       const file = result.assets[0];

//       if (!result.didCancel && result.assets?.length > 0) {
//         const compressedUri = await compressImage(file?.uri);
//         callback({...file, uri: compressedUri});
//       } else {
//         callback(null);
//       }
//     } else if (type === 'gallery') {
//       const result = await launchImageLibrary({
//         mediaType: 'photo',
//         quality: 0.3,
//         conversionQuality: 0.9,
//       });
//       const file = result.assets[0];

//       if (!result.didCancel && result.assets?.length > 0) {
//         const compressedUri = await compressImage(file?.uri);
//         callback({...file, uri: compressedUri});
//       } else {
//         callback(null);
//       }
//     } else if (type === 'document') {
//       const res = await pick({
//         allowMultiSelection: false,
//         type: [types.pdf, types.images],
//       });
//       callback(res[0]);
//     }
//   } catch (err) {
//     if (err?.code === 'DOCUMENT_PICKER_CANCELED') {
//       callback(null);
//     } else {
//       callback(null);
//     }
//   }
// };

export const handleFileSelection = async (type, callback) => {
  try {
    let result;

    if (type === 'camera') {
      result = await launchCamera({
        mediaType: 'photo',
        quality: 0.5,
        saveToPhotos: true,
        conversionQuality: 0.9,
      });
    } else if (type === 'gallery') {
      result = await launchImageLibrary({
        mediaType: 'photo',
        quality: 0.5,
        conversionQuality: 0.9,
      });
    } else if (type === 'document') {
      const res = await pick({
        allowMultiSelection: false,
        type: [types.pdf, types.images],
      });
      return callback(res?.[0] || null);
    }

    if (result?.didCancel || !result?.assets?.length) {
      return callback(null);
    }

    const file = result.assets[0];
    const compressedUri = await compressImage(file.uri);
    callback({...file, uri: compressedUri});
  } catch (err) {
    if (err?.code !== 'DOCUMENT_PICKER_CANCELED') {
      console.error('File selection error:', err);
    }
    callback(null);
  }
};

/**
 * Extracts file type from a file URI.
 *
 * @param {string} fileUri - URI of the file.
 * @returns {'image' | 'pdf' | 'doc' | null} - File type.
 */
export const getFileType = fileUri => {
  if (!fileUri) {
    return null;
  }

  const ext = fileUri.split('.').pop().toLowerCase();

  if (['jpg', 'jpeg', 'png', 'webp'].includes(ext)) {
    return 'Image';
  }
  if (ext === 'pdf') {
    return 'PDF';
  }
  if (['doc', 'docx'].includes(ext)) {
    return 'Doc';
  }

  return null;
};

/**
 * Helper to view documents or images from URI.
 *
 * @param {string} uri - The URI to the document (can be HTTP, HTTPS, or local file path).
 * @param {(uri: string) => void} [onImage] - Callback if the file is an image.
 * @param {(error: Error) => void} [onError] - Callback if an error occurs.
 * @param {() => void} [onLoading] - Callback when loading finishes.
 */

export const viewDocumentHelper = async (uri, onImage, onError, onLoading) => {
  let type = '';
  try {
    if (
      !uri ||
      typeof uri !== 'string' ||
      !(
        uri.startsWith('http://') ||
        uri.startsWith('https://') ||
        uri.startsWith('file://') ||
        uri.startsWith(RNFS.DocumentDirectoryPath)
      )
    ) {
      throw new Error('Invalid document URI. Must be HTTP(S) or a local file.');
    }

    // Check for image
    if (uri.startsWith('http')) {
      type = await detectFileType(uri);

      if (type === 'image') {
        onImage?.(uri);
        return;
      }

      // Otherwise, download and open
      const extension = 'pdf';
      const localFileName = `temp_file_${Date.now()}.${extension}`;
      const localPath = `${RNFS.DocumentDirectoryPath}/${localFileName}`;

      const result = await RNFS.downloadFile({
        fromUrl: uri,
        toFile: localPath,
      }).promise;

      if (result.statusCode === 200) {
        await FileViewer.open(localPath, {showOpenWithDialog: true});
      } else {
        throw new Error('Failed to download the file.');
      }
    } else {
      // Assume it's a local file (already on device)
      await FileViewer.open(uri, {showOpenWithDialog: true});
    }
  } catch (err) {
    console.warn('Error opening file:', err);
    if (err.message.includes('No app associated with this mime type')) {
      openInBrowser(
        `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(
          uri,
        )}`,
      );
      // return Alert.alert(
      //   'No App Found',
      //   `Please install an app to open ${type} file type.`,
      // );
    }
    onError?.(err);
  } finally {
    onLoading?.();
  }
};

/**
 * Formats the document images by creating a consistent object structure
 * only for keys that are present in the response.
 *
 * @param {Object} response - API response object containing document keys and image names.
 * @param {string} baseUrl - Base URL to prepend to image file names.
 * @returns {Object} formatted - Object with formatted document image info.
 */

export const formatDocumentImages = (response = {}, baseUrl = '') => {
  if (response === null || response === undefined) {
    return {};
  }
  const formatted = {};

  const otherDocumentTypeMap = {
    APPLICATION_FORM: 'applicationFormImage',
    PASSPORT_SIZE_PHOTO: 'passportImage',
    CO_APPLICANT_DOCUMENTS: 'coapplicantImage',
  };

  // First format all static image keys
  Object.values(documentImageType).forEach(key => {
    const value = response[key];
    if (value !== null && value !== undefined) {
      const imageUrl =
        typeof value === 'object' && value.url ? value.url : value;
      formatted[key] = {
        uri: `${baseUrl}${imageUrl}`,
        uploadedUrl: `${baseUrl}${imageUrl}`,
        isLocal: false,
        type: null,
        fileSize: null,
        uploadKey: imageUrl,
      };
    }
  });

  // Handle one of the conditional keys based on otherDocuments
  const otherDocKey = otherDocumentTypeMap[response.otherDocuments];
  if (
    otherDocKey &&
    response[otherDocKey] !== null &&
    response[otherDocKey] !== undefined
  ) {
    const value = response[otherDocKey];
    const imageUrl = typeof value === 'object' && value.url ? value.url : value;
    formatted[otherDocKey] = {
      uri: `${baseUrl}${imageUrl}`,
      uploadedUrl: `${baseUrl}${imageUrl}`,
      isLocal: false,
      type: null,
      fileSize: null,
    };
  }

  delete formatted.otherDocuments;
  return formatted;
};

/**
 * Convert formatted images to minimal response payload for submission.
 * @param {Object} formattedImages - The object with formatted image data.
 * @param {String} customerId - The customer's ID.
 * @returns {Object} - The payload to send to backend.
 */
export const generateImageUploadPayload = (
  formattedImages,
  customerId,
  isEdit = false,
  imageKeys = [
    documentImageType.ID_PROOF,
    documentImageType.ADDRESS_PROOF,
    documentImageType.PERMANENT_ADDRESS,
    documentImageType.INCOME_PROOF,
    documentImageType.BANKING_PROOF,
    documentImageType.BUSINESS_PROOF,
    documentImageType.INSURANCE,
    documentImageType.OTHER_DOCUMENTS,
  ],
) => {
  const payload = {
    customerId,
  };

  imageKeys.forEach(key => {
    const uploadedUrl = formattedImages?.[key]?.uploadKey;
    const selectedDocType = formattedImages?.[key]?.selectedDocType;
    const documentTypeKey = documentType[key];

    if (uploadedUrl || isEdit) {
      payload[key] = uploadedUrl || null;
      if (documentTypeKey !== undefined) {
        payload[documentTypeKey] = selectedDocType || null;
      }
    }
  });

  return payload;
};

export const validateRequiredDocuments = (documents, requiredFields) => {
  if (!documents || Object.keys(documents).length === 0) {
    showToast('error', 'Please upload required documents.');
    return false;
  }

  const missingFields = requiredFields.filter(
    field => !documents[field] || !documents[field].uri,
  );

  if (missingFields.length > 0) {
    const missingLabels = missingFields
      .map(field => documentImageLabelMap?.[field] || field)
      .join(', ');
    showToast('error', `Please upload: ${missingLabels}`, 'bottom', 3500);
    return false;
  }

  return true;
};

const detectFileType = async url => {
  try {
    const response = await fetch(url, {method: 'HEAD'});
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType !== 'text/plain') {
      if (contentType.startsWith('image/')) {
        return 'image';
      }
      if (contentType === 'application/pdf') {
        return 'pdf';
      }
      return contentType;
    }

    // Fallback to file extension
    return getMimeFromUrl(url);
  } catch (error) {
    console.error('File type detection failed:', error);
    return 'error';
  }
};

export const getMimeFromUrl = url => {
  if (!url) {
    return;
  }
  const cleanUrl = url?.split('?')[0]; // Remove query params
  const extension = cleanUrl.split('.').pop().toLowerCase();

  const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const docExts = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];

  if (imageExts.includes(extension)) {
    return 'image';
  }
  if (docExts.includes(extension)) {
    return extension;
  }

  return 'unknown';
};

// utils/transformDocumentData.js

/**
 * Transforms document response to formatted file objects with presigned download URLs
 * @param {Object} responseData - Original API response's `data` object
 * @returns {Promise<Object>} - Formatted object with metadata and download URLs
 */
export const transformDocumentData = async (responseData, documentKey = []) => {
  const formattedData = {};

  const fileKeys = Object.keys(responseData).filter(
    key =>
      documentKey.includes(key) &&
      responseData[key] &&
      typeof responseData[key] === 'string',
  );

  for (const key of fileKeys) {
    const uri = responseData[key];
    const acceptedDocType = responseData[documentType[key]];
    try {
      const {data} = await getPresignedDownloadUrl({objectKey: uri});
      formattedData[key] = {
        uploadKey: uri,
        uploadedUrl: uri,
        uri: data?.url || null,
        isLocal: false,
        selectedDocType: acceptedDocType,
      };
    } catch (error) {
      formattedData[key] = {
        uploadKey: uri,
        uploadedUrl: uri,
        uri: uri,
        isLocal: false,
        selectedDocType: null,
      };
    }
  }

  return formattedData;
};

// export const transformDocumentData = async (responseData, documentKey) => {
//   console.log({responseData});
//   console.log({documentKey});
//   const formattedData = {};
//   const fileKeys = Object.keys(responseData).filter(
//     key => responseData[key] && typeof responseData[key] === 'string',
//   );

//   for (const key of fileKeys) {
//     const uri = responseData[key];
//     try {
//       const {data} = await getPresignedDownloadUrl({objectKey: uri});
//       formattedData[key] = {
//         uploadKey: uri,
//         uploadedUrl: uri,
//         uri: data?.url || null,
//         isLocal: false,
//       };
//     } catch (error) {
//       console.error(`Failed to get presigned URL for ${key}`, error);
//       formattedData[key] = {
//         uploadKey: uri,
//         uploadedUrl: uri,
//         uri: uri,
//       };
//     }
//   }

//   return formattedData;
// };

export const openInBrowser = async url => {
  try {
    const supported = await Linking.openURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('Error', 'Cannot open this URL.');
    }
  } catch (error) {
    Alert.alert('Error', 'Failed to open browser.');
    console.error('Failed to open URL:', error);
  }
};

/**
 * Fetches a presigned URL for the given document URI.
 * Only makes API call if URI is valid.
 *
 * @param {string} uri - The object key for the document.
 * @returns {Promise<string|null>} - The presigned URL or null if invalid input.
 */
export const getDocumentLink = async uri => {
  if (!uri || typeof uri !== 'string') {
    console.log('Invalid URI provided to getDocumentLink:', uri);
    return null;
  }

  try {
    const {data} = await getPresignedDownloadUrl({objectKey: uri});
    return data?.url || null;
  } catch (error) {
    console.error('Error fetching document link:', error);
    return null;
  }
};

/**
 * Builds the full document list for a partner.
 *
 * @param {Object} partnerDetail - Partner details with uploaded/missing documents.
 * @param {(type: string, url?: string) => void} onPressHandler - Callback when item is pressed.
 * @returns {Array} - List of document objects.
 */
// export const buildDocumentsArray = (partnerDetail, onPressHandler) => {
//   const allDocTypes = Object.keys(partnerDocumentLabelMap);
//   const uploadedDocs = partnerDetail?.documents || [];
//   const missingDocs = partnerDetail?.missingDocuments || [];

//   return allDocTypes.map(type => {
//     const uploadedDoc = findUploadedDoc(type, uploadedDocs);
//     return {
//       label: partnerDocumentLabelMap[type],
//       documentType: type,
//       uploaded: !!uploadedDoc,
//       isMissing: missingDocs.includes(type),
//       ...uploadedDoc,
//       onPress: () => onPressHandler(type, uploadedDoc?.documentUrl),
//     };
//   });
// };

export const buildDocumentsArray = (partnerDetail, onPressHandler) => {
  const allDocTypes = Object.keys(partnerDocumentLabelMap);
  const uploadedDocs = partnerDetail?.documents || [];
  const missingDocs = partnerDetail?.missingDocuments || [];

  return allDocTypes.map(type => {
    const uploadedDoc = findUploadedDoc(type, uploadedDocs);
    const uploaded = !!uploadedDoc;
    const isMissing = missingDocs.includes(type);

    return {
      label: partnerDocumentLabelMap[type],
      documentType: type,
      uploaded,
      isMissing,
      ...uploadedDoc,
      onPress: () =>
        onPressHandler(type, uploadedDoc?.documentUrl, isMissing || !uploaded),
    };
  });
};

/**
 * Finds an uploaded document from a list by type.
 *
 * @param {string} type - Document type.
 * @param {Array} uploadedDocs - Array of uploaded documents.
 * @returns {Object | undefined} - The matched document or undefined.
 */
const findUploadedDoc = (type, uploadedDocs = []) =>
  uploadedDocs.find(doc => doc.documentType === type);

export const transformPartnerDocumentData = async (
  responseData,
  documentKey = [],
) => {
  const formattedData = {};

  // Handle both responseData.responseData and direct array
  const documents = Array.isArray(responseData?.responseData)
    ? responseData.responseData
    : responseData;

  if (!Array.isArray(documents)) {
    console.warn('Invalid document data received:', responseData);
    return formattedData;
  }

  for (const doc of documents) {
    const key = doc.documentType;
    const uri = doc.documentUrl;

    // Skip if filtered list is provided
    if (documentKey.length > 0 && !documentKey.includes(key)) {
      continue;
    }

    try {
      const {data} = await getPresignedDownloadUrl({objectKey: uri});

      formattedData[key] = {
        uploadKey: uri,
        uploadedUrl: uri,
        uri: data?.url || null,
        isLocal: false,
        selectedDocType: key,
        ...doc,
      };
    } catch (error) {
      console.error(`Failed to get presigned URL for ${key}`, error);

      formattedData[key] = {
        uploadKey: uri,
        uploadedUrl: uri,
        uri,
        isLocal: false,
        selectedDocType: key,
        actualObject: doc, // <-- still include the original doc on error
        ...doc,
      };
    }
  }

  return formattedData;
};

export const getDocumentRequirements = (
  loanProduct,
  typeOfIndividual,
  orderList,
) => {
  if (!loanProduct || !typeOfIndividual) {
    return orderList;
  }

  if (typeOfIndividual === occupationType.OTHER) {
    return orderList;
  }

  // Step 1: Get matching items
  const filtered = loan_document_requirements.filter(
    item =>
      item.loanProduct === loanProduct &&
      item.typeOfIndividual === typeOfIndividual,
  );

  const _types = filtered.map(item => item.documentType);

  // Step 3: Sort based on your enum order
  const order = Object.values(documentImageType);

  const sorted = _types.sort((a, b) => order.indexOf(a) - order.indexOf(b));

  return sorted;
};
