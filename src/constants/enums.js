// ===================== Sales Executive Constants =====================

/**
 * Enum for Sales Executive Positions.
 * Used for backend communication and internal mapping.
 */
export const salesExecutivePosition = Object.freeze({
  SALES_EXECUTIVE: 'SALES_EXECUTIVE',
  SENIOR_SALES_EXECUTIVE: 'SENIOR_SALES_EXECUTIVE',
  TEAM_LEAD: 'TEAM_LEAD',
  MANAGER: 'MANAGER',
});

/**
 * Dropdown options for Sales Executive Position selection.
 * Used in forms, UI dropdowns, or selectors.
 */
export const salesExecOptions = [
  {
    id: '1',
    label: 'Sales Executive',
    value: salesExecutivePosition.SALES_EXECUTIVE,
  },
  {
    id: '2',
    label: 'Senior Sales Executive',
    value: salesExecutivePosition.SENIOR_SALES_EXECUTIVE,
  },
  {id: '3', label: 'Team Lead', value: salesExecutivePosition.TEAM_LEAD},
  {id: '4', label: 'Manager', value: salesExecutivePosition.MANAGER},
];

/**
 * Mapping of Sales Executive Position value to its display label.
 */
export const salesExecutiveValue = {
  [salesExecutivePosition.SALES_EXECUTIVE]: 'Sales Executive',
  [salesExecutivePosition.SENIOR_SALES_EXECUTIVE]: 'Senior Sales Executive',
  [salesExecutivePosition.TEAM_LEAD]: 'Team Lead',
  [salesExecutivePosition.MANAGER]: 'Manager',
};

// ===================== Business Type Constants =====================

/**
 * Enum for Business Type values.
 */
export const businessType = Object.freeze({
  PVT_LTD: 'PVT_LTD',
  PROPRIETORSHIP: 'PROPRIETORSHIP',
  PARTNERSHIP: 'PARTNERSHIP',
  LLP: 'LLP',
  OTHER: 'OTHER',
});

/**
 * Dropdown options for Business Type selection.
 */
export const businessTypeOptions = [
  {id: '1', label: 'PVT Limited', value: businessType.PVT_LTD},
  {
    id: '2',
    label: 'Proprietorship/Individual',
    value: businessType.PROPRIETORSHIP,
  },
  {id: '3', label: 'Partnership', value: businessType.PARTNERSHIP},
  {id: '4', label: 'LLP', value: businessType.LLP},
  {id: '5', label: 'Other', value: businessType.OTHER},
];

/**
 * Mapping of Business Type value to its display label.
 */
export const businessTypeValue = {
  [businessType.PVT_LTD]: 'PVT Limited',
  [businessType.PROPRIETORSHIP]: 'Proprietorship/Individual',
  [businessType.PARTNERSHIP]: 'Partnership',
  [businessType.LLP]: 'LLP',
  [businessType.OTHER]: 'Other',
};

// ===================== Partner Onboarding Status Constants =====================

/**
 * Enum for Partner Onboarding Status values.
 */
export const partnerOnboardingStatus = Object.freeze({
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
});

/**
 * Dropdown options for Partner Onboarding Status selection.
 */
export const partnerOnboardingStatusOptions = [
  {id: '1', label: 'Approved', value: partnerOnboardingStatus.APPROVED},
  {id: '2', label: 'Rejected', value: partnerOnboardingStatus.REJECTED},
  {id: '3', label: 'Pending', value: partnerOnboardingStatus.PENDING},
];

/**
 * Mapping of Partner Onboarding Status value to its display label.
 */
export const partnerOnboardingStatusValue = {
  [partnerOnboardingStatus.APPROVED]: 'Approved',
  [partnerOnboardingStatus.REJECTED]: 'Rejected',
  [partnerOnboardingStatus.PENDING]: 'Pending',
};

// ===================== Partner User Position Constants =====================

/**
 * Enum for Partner User Positions.
 */
export const partnerUserPosition = Object.freeze({
  DEALER_PRINCIPLE: 'DEALER_PRINCIPLE',
  SENIOR_MANAGEMENT: 'SENIOR_MANAGEMENT',
  EMPLOYEE: 'EMPLOYEE',
});

/**
 * Dropdown options for Partner User Position selection.
 */
export const partnerUserPositionOptions = [
  {
    id: '1',
    label: 'Dealer Principle',
    value: partnerUserPosition.DEALER_PRINCIPLE,
  },
  {
    id: '2',
    label: 'Senior Management',
    value: partnerUserPosition.SENIOR_MANAGEMENT,
  },
  {id: '3', label: 'Employee', value: partnerUserPosition.EMPLOYEE},
];

/**
 * Mapping of Partner User Position value to its display label.
 */
export const partnerUserPositionValue = {
  [partnerUserPosition.DEALER_PRINCIPLE]: 'Dealer Principle',
  [partnerUserPosition.SENIOR_MANAGEMENT]: 'Senior Management',
  [partnerUserPosition.EMPLOYEE]: 'Employee',
};

// ===================== Settlement Preference Constants =====================

/**
 * Enum for Settlement Preferences.
 */
export const settlementPreference = Object.freeze({
  NEFT: 'NEFT',
  IMPS: 'IMPS',
});

/**
 * Dropdown options for Settlement Preference selection.
 */
export const settlementPreferenceOptions = [
  {
    id: '1',
    label: 'NEFT',
    value: settlementPreference.NEFT,
  },
  {
    id: '2',
    label: 'IMPS',
    value: settlementPreference.IMPS,
  },
];

/**
 * Mapping of Settlement Preference value to its display label.
 */
export const settlementPreferenceValue = {
  [settlementPreference.NEFT]: 'NEFT',
  [settlementPreference.IMPS]: 'IMPS',
};

// ===================== Common Status Constants =====================

/**
 * Enum for Common Statuses.
 */
export const commonStatus = Object.freeze({
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  PENDING: 'PENDING',
});

/**
 * Mapping of Common Status value to its display label.
 */
export const commonStatusValue = {
  [commonStatus.APPROVED]: 'Approved',
  [commonStatus.REJECTED]: 'Rejected',
  [commonStatus.PENDING]: 'Pending',
};

// ===================== Partner Document Types =====================

/**
 * Enum for Partner Document Types.
 */
export const partnerDocumentType = Object.freeze({
  GST_REGISTRATION: 'GST_REGISTRATION',
  SHOP_LICENSE: 'SHOP_LICENSE',
  PAN_CARD: 'PAN_CARD',
  AADHAR_CARD_FRONT: 'AADHAR_CARD_FRONT',
  AADHAR_CARD_BACK: 'AADHAR_CARD_BACK',
  BANK_STATEMENT: 'BANK_STATEMENT',
  CANCELLED_CHEQUE: 'CANCELLED_CHEQUE',
  PHOTOGRAPH: 'PHOTOGRAPH',
});

/**
 * Mapping of Partner Document Type value to its display label.
 */
export const partnerDocumentLabelMap = {
  [partnerDocumentType.GST_REGISTRATION]: 'GST Registration',
  [partnerDocumentType.SHOP_LICENSE]: 'Shop License',
  [partnerDocumentType.PAN_CARD]: 'PAN Card',
  [partnerDocumentType.AADHAR_CARD_FRONT]: 'Aadhar Card Front',
  [partnerDocumentType.AADHAR_CARD_BACK]: 'Aadhar Card Back',
  [partnerDocumentType.PHOTOGRAPH]: 'Photograph',
  [partnerDocumentType.BANK_STATEMENT]: 'Bank Statement',
  [partnerDocumentType.CANCELLED_CHEQUE]: 'Cancelled Cheque',
};

// ===================== Vehicle Types =====================

/**
 * Enum for Vehicle Types.
 */
export const vehicleTypeEnum = Object.freeze({
  USED: 'USED_CAR',
  NEW: 'NEW_CAR',
});

/**
 * Mapping of Vehicle Type value to its display label.
 */
export const vehicleTypeLabels = {
  [vehicleTypeEnum.USED]: 'Used Car',
  [vehicleTypeEnum.NEW]: 'New Car',
};

// ===================== User Type Types =====================

/**
 * Enum for User Types.
 */
export const userTypeEnum = Object.freeze({
  SINGLE: 'SINGLE_USER',
  MULTI: 'MULTI_USER',
});

/**
 * Mapping of User Type value to its display label.
 */
export const userTypeLabels = {
  [userTypeEnum.SINGLE]: 'Single User',
  [userTypeEnum.MULTI]: 'Multi User',
};

// ===================== Dealer Ship Types =====================

/**
 * Enum for Dealership Types.
 */
export const dealershipTypeEnum = Object.freeze({
  OEM: 'OEM',
  MULTI_BRAND: 'MULTI_BRAND',
  DSA: 'DSA',
  BROKER: 'BROKER',
});

/**
 * Mapping of Dealership Type value to its display label.
 */
export const dealershipTypeLabels = {
  [dealershipTypeEnum.OEM]: 'OEM Dealer',
  [dealershipTypeEnum.MULTI_BRAND]: 'Multi-Brand Deaker',
  [dealershipTypeEnum.DSA]: 'DSA',
  [dealershipTypeEnum.BROKER]: 'Broker',
};

// ===================== Application Status =====================

/**
 * Enum for Application Status values.
 */
export const applicationStatus = Object.freeze({
  APPROVED: 'APPROVED',
  IN_REVIEW: 'IN_REVIEW',
  QUERY: 'QUERY',
  REJECTED: 'REJECTED',
  DRAFT: 'DRAFT',
  DISBURSED: 'DISBURSED',
});

/**
 * Dropdown options for Application Status selection.
 */
export const applicationStatusOptions = [
  {id: '1', label: 'Approved', value: applicationStatus.APPROVED},
  {id: '3', label: 'Draft', value: applicationStatus.DRAFT},
  {id: '2', label: 'Rejected', value: applicationStatus.REJECTED},
  {id: '4', label: 'Query', value: applicationStatus.QUERY},
  {id: '5', label: 'In Review', value: applicationStatus.IN_REVIEW},
  {id: '6', label: 'Disbursed', value: applicationStatus.DISBURSED},
];

/**
 * Mapping of Application Status value to its display label.
 */
export const applicationStatusValue = {
  [applicationStatus.APPROVED]: 'Approved',
  [applicationStatus.REJECTED]: 'Rejected',
  [applicationStatus.QUERY]: 'Query',
  [applicationStatus.IN_REVIEW]: 'In Review',
  [applicationStatus.DRAFT]: 'Draft',
  [applicationStatus.DISBURSED]: 'Disbursed',
};

export const getApplicationStatusLabel = status => {
  return applicationStatusValue[status] || '';
};

// ===================== Other Static Constants =====================

export const customerCategory = Object.freeze({
  individual: 'Individual',
  corporate: 'Corporate',
});

export const gender = Object.freeze({
  male: 'male',
  female: 'female',
});

export const currentLoanOptions = Object.freeze({
  yes: 'yes',
  no: 'no',
});

export const loanType = Object.freeze({
  purchase: 1,
  refinance: 2,
  topUp: 3,
  internalBT: 4,
  externalBT: 5,
  loan: 6,
  lease: 7,
  subscribe: 8,
});

export const eVehicleStatus = Object.freeze({
  INVENTORY: 'inventory',
  COLLATERALIZED: 'collateralized',
  DELISTED: 'delisted',
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SOLD: 'sold',
  BLACKLISTED: 'blacklisted',
  OTHER: 'other',
  AVAILABLE: 'available',
});

export const eVehicleCondition = Object.freeze({
  EXCELLENT: 'excellent',
  GOOD: 'good',
  AVERAGE: 'average',
  POOR: 'poor',
  NEW: 'new',
  USED: 'used',
});

export const userRole = Object.freeze({
  ADMIN: 'ADMIN',
  PARTNER: 'PARTNER',
  SALES_EXECUTIVE: 'SALES_EXECUTIVE',
});

// ===================== Helper Functions ======================

/**
 * Returns the label from an enum object based on the provided value.
 *
 * @param {Object} enumObject - The enum object containing value-label mappings.
 * @param {string} value - The key to look up in the enum object.
 * @param {string} [defaultLabel='Unknown'] - The default label to return if the key is not found.
 * @returns {string} The label corresponding to the value, or the default label if not found.
 */
export const getLabelFromEnum = (enumObject, value, defaultLabel = '') => {
  return enumObject?.[value] || defaultLabel;
};

// ======================================================================

export const generateOptionsAndValueMap = enumObject => {
  const options = Object.keys(enumObject).map((key, index) => ({
    id: (index + 1).toString(),
    label: key
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase()),
    value: enumObject[key],
  }));

  const valueMap = options.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
  }, {});

  return {options, valueMap};
};

export const PARTNER_TAB_OPTIONS = ['active', 'pending'];

// const { options: salesExecOptions, valueMap: salesExecutiveValue } = generateOptionsAndValueMap(SalesExecutivePosition);

export const DOCUMENT_LABELS = {
  // idProofImage: 'ID Proof',
  addressProofImage: 'Address Proof',
  // permanentAddressImage: 'Permanent Address',
  incomeProofImage: 'Income Proof',
  bankingProofImage: 'Bank Statement',
  businessProofImage: 'Business Proof',
  // insuranceImage: 'Insurance Document',
  // applicationFormImage: 'Application Form',
  // coapplicantImage: 'Co-applicant Document',
  // passportImage: 'Passport',
};

export const KYC_LABELS = {
  pancardPhoto: 'PAN Card',
  aadharFrontPhoto: 'Aadhar Card Front',
  aadharBackphoto: 'Aadhar Card Back',
};

export const API_TRIGGER = {
  DEFAULT: 'default',
  LOAD_MORE: 'loadMore',
  PULL_TO_REFRESH: 'pullToRefresh',
};
