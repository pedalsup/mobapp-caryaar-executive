import moment from 'moment';
import Toast from 'react-native-toast-message';
import {applicationStatus} from '../constants/enums';
import theme from '../theme';
import colors from '../theme/colors';
import {navigate} from '../navigation/NavigationUtils';
import ScreenNames from '../constants/ScreenNames';
import get from 'lodash/get';

/**
 * Format a numeric value into Indian currency style (e.g., ₹12,34,567.89)
 * @param {string | number} value - The number to format
 * @param {boolean} [showSign=true] - Whether to prefix with ₹
 * @returns {string}
 */
export const formatIndianNumber = (value, showSign = true) => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }

  const [intPart, decimalPart] = value?.toString().split('.');
  let cleaned = intPart.replace(/[^0-9]/g, '');

  if (!cleaned) {
    return '-';
  }

  let lastThree = cleaned.slice(-3);
  let otherNumbers = cleaned.slice(0, -3);
  if (otherNumbers !== '') {
    lastThree = ',' + lastThree;
  }

  const formatted =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree;

  const formatAmount = decimalPart ? `${formatted}.${decimalPart}` : formatted;
  return showSign ? `₹${formatAmount}` : formatAmount;
};

/**
 * Remove unwanted characters from a currency input string
 * @param {string} text
 * @returns {string}
 */
export const formatAmount = text =>
  text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

/**
 * Return background color for given application status
 * @param {string} status
 * @returns {string}
 */
export const getStatusColor = status => {
  switch (status) {
    case 'SAVED':
      return '#1D95F0';
    case 'IN_PROGRESS':
      return 'rgba(243, 105, 110, 0.12)';
    case 'COMPLETED':
      return 'rgba(110, 238, 135, 0.2)';
    default:
      return theme.colors.textPrimary;
  }
};

/**
 * Get loan gradient color based on loan status
 * @param {number} status
 * @returns {string[]}
 */
export const getGradientColorsLoan = status => {
  switch (status) {
    case 1:
      return ['#E8E8E8', '#E8E8E8'];
    case 2:
      return ['#F8A902', '#F3696E'];
    case 3:
      return ['#6EEE87', '#5FC52E'];
    case 4:
      return ['#FF5B5E', '#B60003'];
    default:
      return ['#E8E8E8', '#E8E8E8'];
  }
};

/**
 * Format location string from city and state
 * @param {string} city
 * @param {string} state
 * @returns {string}
 */
export const getLocationText = (city, state) => {
  return [city, state].filter(Boolean).join(', ');
};

/**
 * Attempts to parse and format a date string safely using known formats.
 * Prevents Moment fallback warnings by strictly validating known formats only.
 *
 * @param {string} inputDate - The input date string.
 * @param {string} outputFormat - The desired output format (default: 'DD MMM YYYY').
 * @returns {string} Formatted date or empty string if invalid.
 */
export const formatDate = (inputDate, outputFormat = 'DD MMM YYYY') => {
  if (!inputDate || typeof inputDate !== 'string') {
    return '-';
  }

  // List of known safe formats (add more if needed)
  const knownFormats = [
    moment.ISO_8601,
    'YYYY-MM-DD',
    'YYYY/MM/DD',
    'MM-DD-YYYY',
    'DD-MM-YYYY',
    'MM/DD/YYYY',
    'DD/MM/YYYY',
    'YYYY-MM-DDTHH:mm:ssZ',
    'YYYY-MM-DD HH:mm:ss',
  ];

  let parsedDate;

  for (const format of knownFormats) {
    parsedDate = moment(inputDate, format, true); // strict parsing
    if (parsedDate.isValid()) {
      break;
    }
  }

  return parsedDate?.isValid() ? parsedDate.format(outputFormat) : '-';
};

/**
 * Format full partner address string
 * @param {Object} d - Partner detail object
 * @returns {string}
 */
export const getPartnerAddress = d =>
  [
    d?.shopNo,
    d?.buildingName,
    d?.streetAddress,
    d?.area,
    d?.city,
    d?.state,
    d?.pincode,
  ]
    .filter(Boolean)
    .join(', ');

/**
 * Parse API error object into readable message
 * @param {any} error
 * @returns {string}
 */
export const getErrorMessage = error => {
  try {
    // if (error?.message === 'Network Error') {
    //   return 'Please check your internet connection.';
    // }
    const message = error?.response?.data?.message;
    return message || 'Something went wrong';
  } catch {
    return 'Something went wrong';
  }
};

/**
 * Show toast message
 * @param {'success'|'error'|'info'|'warning'} type
 * @param {string} message
 * @param {'top'|'bottom'} [position='bottom']
 * @param {number} [visibilityTime=2000]
 */
export const showToast = (
  type = 'warning',
  message = '',
  position = 'bottom',
  visibilityTime = 2000,
) => {
  Toast.show({
    type,
    text1: message,
    position,
    bottomOffset: 100,
    topOffset: 100,
    visibilityTime,
  });
};

// export const showToast = (
//   type = 'warning',
//   message = '',
//   positionOrTime = 'bottom',
//   visibilityTime = 2000,
// ) => {
//   let position = 'bottom';
//   let time = visibilityTime;

//   if (!isNaN(positionOrTime)) {
//     time = Number(positionOrTime);
//   } else {
//     position = positionOrTime;
//   }

//   Toast.show({
//     type,
//     text1: message,
//     position,
//     bottomOffset: 100,
//     topOffset: 100,
//     visibilityTime: time,
//   });
// };

/**
 * Show API error toast
 * @param {any} error
 */
export const showApiErrorToast = error => {
  let type = 'warning';
  let message = getErrorMessage(error);
  if (error?.status === 1001) {
    type = 'warning';
    message = 'Service is temporarily unavailable. Please try again later.';
  }
  showToast(type, message, 'bottom', 3000);
};

/**
 * Show API success toast
 * @param {Object} response
 */
export const showApiSuccessToast = response => {
  if (response?.success && response?.message) {
    showToast('success', response.message, 'bottom', 3000);
  }
};

/**
 * Ensure mobile number has +91 prefix
 * @param {string} num
 * @returns {string}
 */
export const formatMobileNumber = num => {
  return num.startsWith('+91') ? num : `+91${num}`;
};

/**
 * Remove country code from phone number
 * @param {string} phoneNumber
 * @param {string} [defaultCountryCode='91']
 * @returns {string}
 */
export const removeCountryCode = (phoneNumber, defaultCountryCode = '91') => {
  if (!phoneNumber) {
    return '';
  }

  const digitsOnly = phoneNumber.replace(/\D/g, '');

  if (digitsOnly.startsWith(defaultCountryCode)) {
    return digitsOnly.slice(defaultCountryCode.length);
  }

  if (digitsOnly.startsWith('0')) {
    return digitsOnly.slice(1);
  }

  return digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
};

// utils/dateUtils.js

/**
 * Returns a relative time string (e.g., "5 minutes ago") from a date string.
 * Uses Moment.js with strict ISO 8601 parsing to avoid deprecation warnings.
 *
 * @param {string} dateString - The date string in ISO 8601 format.
 * @returns {string} Relative time or empty string if invalid.
 */
export function getRelativeTime(dateString) {
  // Strictly parse date using ISO 8601 format
  const date = moment(dateString, moment.ISO_8601, true);

  // Validate parsed date
  if (!date.isValid()) {
    return '';
  }

  // Return relative time (e.g., "3 days ago", "just now")
  return date.fromNow();
}

// export function getRelativeTime(dateString) {
//   const date = new Date(dateString);

//   if (isNaN(date.getTime())) {
//     return '';
//   }

//   const now = new Date();
//   const diffInSeconds = Math.floor((now - date) / 1000);

//   const units = [
//     {name: 'year', seconds: 31536000},
//     {name: 'month', seconds: 2592000},
//     {name: 'week', seconds: 604800},
//     {name: 'day', seconds: 86400},
//     {name: 'hour', seconds: 3600},
//     {name: 'minute', seconds: 60},
//     {name: 'second', seconds: 1},
//   ];

//   for (const unit of units) {
//     const interval = Math.floor(diffInSeconds / unit.seconds);
//     if (interval >= 1) {
//       return `${interval} ${unit.name}${interval > 1 ? 's' : ''} ago`;
//     }
//   }

//   return 'just now';
// }

/**
 * Navigates to the correct screen based on stepId.
 *
 * @param {number} stepId - The step identifier (1–4).
 * @param {object} screenParams - The shared params to pass during navigation.
 */
export const handleStepNavigation = (stepId, screenParams = {}) => {
  const stepRoutes = {
    1: ScreenNames.AddPartnerBasicDetail,
    2: ScreenNames.AddPartnerBusinessLocation,
    3: ScreenNames.AddPartnerRequiredDocument,
    4: ScreenNames.AddPartnersBankDetail,
  };

  const route = stepRoutes[stepId];

  if (route) {
    navigate(route, {params: screenParams});
  } else {
    console.warn(`No screen defined for stepId: ${stepId}`);
  }
};

/**
 * Returns a human-readable time difference between two dates
 * (e.g., "2 months", "1 year", "5 seconds").
 *
 * @param {string | Date} from - The starting date.
 * @param {string | Date} [to=new Date()] - The ending date (defaults to now).
 * @returns {string} - Formatted time difference.
 */
export const getTimeDifference = (from, to = new Date()) => {
  const fromMoment = moment(from);
  const toMoment = moment(to);

  // Validate both dates
  if (!fromMoment.isValid() || !toMoment.isValid()) {
    return '-';
  }

  const duration = moment.duration(toMoment.diff(fromMoment));

  const format = (value, unit) => `${value} ${unit}${value > 1 ? 's' : ''}`;

  if (duration.asYears() >= 1) {
    const years = Math.floor(duration.asYears());
    return format(years, 'year');
  }
  if (duration.asMonths() >= 1) {
    const months = Math.floor(duration.asMonths());
    return format(months, 'month');
  }
  if (duration.asDays() >= 1) {
    const days = Math.floor(duration.asDays());
    return format(days, 'day');
  }
  if (duration.asHours() >= 1) {
    const hours = Math.floor(duration.asHours());
    return format(hours, 'hour');
  }
  if (duration.asMinutes() >= 1) {
    const minutes = Math.floor(duration.asMinutes());
    return format(minutes, 'minute');
  }

  const seconds = Math.floor(duration.asSeconds());
  return format(seconds, 'second');
};

export const formatValueWithUnit = ({
  value,
  loading = false,
  unit = '',
  fallback = '-',
  showZero = true,
}) => {
  if (loading) {
    return fallback;
  }
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  if (!showZero && Number(value) === 0) {
    return fallback;
  }

  return unit ? `${value} ${unit}` : `${value}`;
};

/**
 * Get gradient color array based on application status
 * @param {number} status
 * @returns {string[]}
 */
export const getApplicationGradientColors = status => {
  switch (status) {
    case applicationStatus.IN_REVIEW:
      return theme.colors.appliedGradient;
    case applicationStatus.APPROVED:
    case applicationStatus.DISBURSED:
      return theme.colors.lenderApprovedGradient;
    case applicationStatus.REJECTED:
    case applicationStatus.QUERY:
      return theme.colors.onHoldGradient;
    case applicationStatus.DRAFT:
      return ['#E8E8E8', '#E8E8E8'];
    default:
      return theme.colors.appliedGradient;
  }
};

/**
 * Return background color for given application status
 * @param {string} status
 * @returns {string}
 */
export const getApplicationStatusColor = status => {
  switch (status) {
    case applicationStatus.IN_REVIEW:
    case applicationStatus.APPROVED:
    case applicationStatus.REJECTED:
    case applicationStatus.QUERY:
    case applicationStatus.DISBURSED:
      return 'rgba(0, 0, 0, 0.36)';
    case applicationStatus.DRAFT:
      return '#828282';
    default:
      return theme.colors.textPrimary;
  }
};

/**
 * Safely gets a value from an object, returns fallback if loading or value is undefined.
 *
 * @param {Object} obj - The source object.
 * @param {string | Array<string>} path - Path to the property (lodash-style).
 * @param {boolean} loading - If true, fallback will be returned regardless of value.
 * @param {*} fallback - The fallback value if not found or loading is true.
 * @returns {*} The resolved value or fallback.
 */
export const safeGet = (loading = false, obj, path, fallback = '-') => {
  return loading ? fallback : get(obj, path, fallback);
};
