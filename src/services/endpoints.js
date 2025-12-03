export const endpoints = {
  LOAN_APPLICATION: {
    LIST: '/v1/loan-applications/',
    BY_ID: id => `/v1/loan-applications/${id}`,
  },
  BANKS: {
    LIST: '/v1/banks',
    BY_SEARCH_CODE: bankName => `/v1/banks/${encodeURIComponent(bankName)}`,
    SEARCH: query => `/v1/banks?search=${encodeURIComponent(query)}`,
    VERIFY_IFSC: (bankName, ifscCode) =>
      `/v1/banks/verify-ifsc?bankName=${encodeURIComponent(
        bankName,
      )}&ifscCode=${encodeURIComponent(ifscCode)}`,
  },
  UPLOAD: {
    PRESIGNED_UPLOAD: '/v1/presigned/upload-url',
    PRESIGNED_DOWNLOAD: '/v1/presigned/download-url',
    FORM_UPLOAD: '/v1/upload/image',
  },
  NOTIFICATIONS: {
    COUNTS: '/v1/notifications/counts',
    LIST: '/v1/notifications',
    READ_ALL: '/v1/notifications/read-all',
    READ_ONE: id => `/v1/notifications/${id}/read`,
  },
  PARTNERS: {
    LIST: '/v1/partners',
    BY_ID: id => `/v1/partners/${id}`,
    PERFORMANCE: '/v1/partners/get-partner-performances',
    STATS: '/v1/partners/stats',
  },
  SALES_EXECUTIVES: {
    LIST: query => `/v1/sales-executives?${query}`,
    BY_ID: id => `/v1/sales-executives/${id}`,
    CREATE: '/v1/sales-executives',
    DELETE: id => `/v1/sales-executives/${id}`,
  },
  USER: {
    LOGIN: type => `/v1/user/login?type=${encodeURIComponent(type)}`,
    UPDATE_PROFILE: '/v1/user/update-profile',
    CHANGE_PASSWORD: '/v1/user/change-password',
    PROFILE: '/v1/user/profile',
  },
};
