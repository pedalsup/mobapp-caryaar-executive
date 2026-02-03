/**
 * Validate a form field by key
 * @param {string} key
 * @param {string} value
 * @returns {string} - Error message if invalid, otherwise empty string
 */
export const validateField = (key, value, isOptional) => {
  const nameRegex = /^[A-Za-z\s]+$/;
  const numericRegex = /^[0-9]+(\.[0-9]+)?$/;
  const integerRegex = /^[0-9]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // const mobileNumberRegex = /^[0-9]{10}$/;
  const mobileNumberRegex = /^(?:\+91|91)?[0-9]{10}$/;
  const pincodeRegex = /^[0-9]{6}$/;
  const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  const accountNumberRegex = /^[0-9]{9,18}$/;
  // const aadharRegex = /^[1-9]{1}[0-9]{11}$/;
  const aadharRegex = /^([1-9]{1}[0-9]{11}|X{8}[0-9]{4})$/;

  const trimmedValue = typeof value === 'string' ? value.trim() : '';

  if (isOptional) {
    return '';
  }

  switch (key) {
    case 'odometerReading':
      return trimmedValue === ''
        ? 'Please enter the odometer reading'
        : !numericRegex.test(trimmedValue) || trimmedValue.startsWith('.')
        ? 'Odometer must be a valid number (not starting with a decimal)'
        : parseFloat(trimmedValue) <= 0
        ? 'Odometer reading must be greater than 0'
        : parseFloat(trimmedValue) > 1000000
        ? 'Odometer reading seems too high'
        : '';

    case 'vehicleCondition':
      return trimmedValue === ''
        ? 'Please select a valid vehicle condition.'
        : '';

    case 'customerType':
      return trimmedValue === ''
        ? 'Please select a valid individual type.'
        : '';

    case 'amount':
    case 'estimatedPrice':
    case 'salePrice':
    case 'trueValuePrice':
      return trimmedValue === ''
        ? 'Please enter the valid value.'
        : !integerRegex.test(trimmedValue)
        ? 'Value must be a valid number'
        : parseInt(trimmedValue, 10) <= 0
        ? 'Value must be greater than 0'
        : // : parseInt(trimmedValue, 10) > 99999999
          // ? 'Value is too large'
          '';

    case 'mobileNumber':
    case 'mobileNumberHome':
    case 'mobileNumberOffice':
      return trimmedValue === ''
        ? 'Please enter a mobile number'
        : !mobileNumberRegex.test(trimmedValue)
        ? 'Mobile number must be a 10-digit number'
        : '';

    case 'panCardNumber':
      return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(trimmedValue)
        ? ''
        : 'Please enter a valid PAN card number.';

    case 'aadharNumber':
      return trimmedValue === ''
        ? 'Please enter a valid Aadhaar number.'
        : !aadharRegex.test(trimmedValue)
        ? 'Please enter a valid 12-digit Aadhaar number.'
        : '';

    case 'applicantName':
      return trimmedValue === ''
        ? 'Please enter applicant name'
        : !nameRegex.test(trimmedValue)
        ? 'Applicant name should only contain alphabets and spaces'
        : '';

    case 'email':
    case 'emailAddress':
      return trimmedValue === ''
        ? 'Please enter your email address'
        : !emailRegex.test(trimmedValue)
        ? 'Please enter a valid email address'
        : '';

    case 'fatherName':
      return trimmedValue === ''
        ? 'Please enter father/mother name'
        : !nameRegex.test(trimmedValue)
        ? 'Father/mother name should only contain alphabets and spaces'
        : '';

    case 'spouseName':
      return trimmedValue === ''
        ? 'Please enter spouse name'
        : !nameRegex.test(trimmedValue)
        ? 'Spouse name should only contain alphabets and spaces'
        : '';

    case 'address':
    case 'addressHome':
    case 'addressOffice':
      return trimmedValue === '' ? 'Please enter address.' : '';

    case 'pincode':
    case 'pincodeHome':
    case 'pincodeOffice':
      return trimmedValue === ''
        ? 'Please enter a PIN code'
        : !pincodeRegex.test(trimmedValue)
        ? 'PIN code must be a 6-digit number'
        : '';

    case 'occupation':
    case 'incomeSource':
      return trimmedValue === '' ? 'Please select valid option.' : '';

    case 'accountNumber':
      return trimmedValue === ''
        ? 'Please enter an account number'
        : !accountNumberRegex.test(trimmedValue)
        ? 'Account number must be between 9 to 18 digits'
        : '';

    case 'loanAccountNumber':
      return trimmedValue === ''
        ? 'Please enter an loan account number'
        : !accountNumberRegex.test(trimmedValue)
        ? 'Account number must be between 9 to 18 digits'
        : '';

    case 'currentEmi':
    case 'maxEmiAfford':
    case 'avgMonthlyBankBalance':
    case 'monthlyIncome':
    case 'loanAmount':
    case 'monthlyEmi':
      return trimmedValue === ''
        ? 'Please enter a valid amount.'
        : !/^\d+(\.\d{1,2})?$/.test(trimmedValue)
        ? 'Amount must be a valid number, optionally with up to 2 decimal places, and not starting with a decimal point.'
        : parseFloat(trimmedValue) <= 0
        ? 'Amount must be greater than 0'
        : '';

    case 'applicantPhoto':
    case 'pancardPhoto':
    case 'aadharFrontPhoto':
    case 'aadharBackphoto':
      return trimmedValue === '' ? 'Please upload required image' : '';

    case 'dob':
    case 'loanClosedDate':
      return validateDate(trimmedValue, key);

    case 'bankName':
    case 'bankNameValue':
      return trimmedValue === '' ? 'Please enter bank name.' : '';

    case 'fullName':
    case 'ownerName':
    case 'accountHolderName':
      return trimmedValue === ''
        ? `Please enter a valid ${
            key === 'ownerName'
              ? 'owner name'
              : key === 'fullName'
              ? 'fullname'
              : 'account holder name'
          }`
        : !nameRegex.test(trimmedValue)
        ? 'Name should contain only alphabets'
        : '';

    case 'tenure': {
      if (trimmedValue === '') {
        return 'Please enter Loan Tenure.';
      }
      const tenureValue = Number(trimmedValue);
      if (isNaN(tenureValue)) {
        return 'Loan Tenure must be a valid number.';
      }
      if (!Number.isInteger(tenureValue)) {
        return 'Loan Tenure must be a whole number.';
      }
      if (tenureValue <= 0) {
        return 'Loan Tenure must be greater than 0.';
      }
      return '';
    }

    case 'referenceNameHome':
    case 'referenceNameOffice':
      return trimmedValue === ''
        ? 'Please enter Name'
        : !nameRegex.test(trimmedValue)
        ? 'Name should only contain alphabets and spaces'
        : '';

    case 'relationshipHome':
    case 'relationshipOffice':
      return trimmedValue === '' ? 'Please select a relationship.' : '';

    case 'emiPaid': {
      if (trimmedValue === '') {
        return 'Please enter EMI paid.';
      }
      const emiValue = Number(trimmedValue);
      if (isNaN(emiValue)) {
        return 'EMI Paid must be a valid number.';
      }
      if (!Number.isInteger(emiValue)) {
        return 'EMI Paid must be a whole number.';
      }
      if (emiValue < 0) {
        return 'EMI Paid cannot be negative.';
      }
      return '';
    }

    case 'selectedSalesExecValue':
      return trimmedValue === '' ? 'Please select a valid Position' : '';

    case 'carYarPartner':
    case 'salesExecutive':
    case 'salesExecutiveUserId':
    case 'partnerUserId':
      return trimmedValue === '' ? 'Please select required field.' : '';

    case 'carYarPartnerValue':
    case 'salesExecutiveValue':
      return trimmedValue === '' ? 'Please select valid option from list.' : '';

    case 'gender':
      return trimmedValue === '' ? 'Please select gender' : '';

    case 'yearsInBusiness':
    case 'monthlyCarSales':
      return trimmedValue === ''
        ? `Please enter ${
            key === 'yearsInBusiness'
              ? 'number of years in business'
              : 'monthly car sales'
          }`
        : !numericRegex.test(trimmedValue) || trimmedValue.startsWith('.')
        ? `${
            key === 'yearsInBusiness'
              ? 'Years in business'
              : 'Monthly car sales'
          } must be a valid number (not starting with a decimal)`
        : '';

    case 'companyName':
      return trimmedValue === '' ? 'Please enter a valid company name' : '';
    case 'businessName':
      return trimmedValue === '' ? 'Please enter a valid business name' : '';

    case 'shopNo':
      return trimmedValue === ''
        ? 'Please enter a valid shop/office number'
        : '';
    case 'buildingName':
      return trimmedValue === '' ? 'Please enter a valid building name' : '';
    case 'street':
      return trimmedValue === '' ? 'Please enter a valid street' : '';
    case 'area':
      return trimmedValue === '' ? 'Please enter a valid area' : '';
    case 'stateName':
      return trimmedValue === '' ? 'Please select a valid State Name' : '';
    case 'businessType':
      return trimmedValue === '' ? 'Please select a valid business type' : '';
    case 'selectedSalesExec':
    case 'selectedSalesExecValue':
      return trimmedValue === '' ? 'Please select a valid Position' : '';

    case 'branchName':
      return trimmedValue === ''
        ? 'Branch name is required (Verify IFSC code)'
        : '';
    case 'ifscCode':
      return ifscRegex.test(trimmedValue)
        ? ''
        : 'Please enter a valid IFSC code (e.g., HDFC0001234)';

    default:
      return '';
  }
};

/**
 * Handle change for form fields, validate and update state
 * @param {React.Component} component
 * @param {string} key
 * @param {string} value
 */
export const handleFieldChange = (
  component,
  key,
  value,
  isOptional = false,
) => {
  const errorMsg = validateField(key, value, isOptional);

  component.setState(prevState => {
    const updatedErrors = {
      ...prevState.errors,
      [key]: errorMsg,
    };

    const isFormValid = Object.values(updatedErrors).every(
      error => error === '',
    );

    return {
      [key]: value,
      errors: updatedErrors,
      isFormValid,
    };
  });
};

/**
 * Sanitizes and normalizes an amount string:
 * - Removes non-numeric characters except one decimal
 * - Removes leading zeros
 * - Converts valid numbers like "012" -> "12", "12.0" -> "12", "12.50" -> "12.5"
 * - Keeps "12." while typing
 *
 * @param {string} value
 * @returns {string}
 */
// export const sanitizeAmount = value => {
//   if (typeof value !== 'string') {
//     return '';
//   }

//   // Remove invalid characters (keep digits and .)
//   let cleaned = value.replace(/[^0-9.]/g, '');

//   // Allow only one decimal point
//   const parts = cleaned.split('.');
//   if (parts.length > 2) {
//     cleaned = parts[0] + '.' + parts.slice(1).join('');
//   }

//   // Prevent decimal at the start (e.g., ".5" => "0.5")
//   if (cleaned.startsWith('.')) {
//     cleaned = '0' + cleaned;
//   }

//   // Remove leading zeros (but keep "0." intact)
//   if (/^0[0-9]+/.test(cleaned)) {
//     cleaned = cleaned.replace(/^0+/, '');
//   }

//   // If number ends with '.', keep it as-is (user is still typing)
//   if (cleaned.endsWith('.')) {
//     return cleaned;
//   }

//   // If number has decimals like "12.0", convert to number and back
//   const num = parseFloat(cleaned);
//   if (!isNaN(num)) {
//     return cleaned.includes('.') ? cleaned : String(num); // preserve decimal input like "12.01"
//   }

//   return '';
// };

export const sanitizeAmount = value => {
  if (typeof value !== 'string') {
    return '';
  }

  // Remove invalid characters (keep digits and .)
  let cleaned = value.replace(/[^0-9.]/g, '');

  // Allow only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    cleaned = parts[0] + '.' + parts.slice(1).join('');
  }

  // Prevent decimal at the start (e.g., ".5" => "0.5")
  if (cleaned.startsWith('.')) {
    cleaned = '0' + cleaned;
  }

  // Remove leading zeros (but keep "0." or "0.5" intact)
  if (/^0[0-9]+/.test(cleaned)) {
    cleaned = cleaned.replace(/^0+/, '');
  }

  // If ends with '.', it's a partial input – return as-is
  if (cleaned.endsWith('.')) {
    return cleaned;
  }

  // Validate final string without converting to number
  const validNumberPattern = /^\d+(\.\d+)?$/;
  if (validNumberPattern.test(cleaned)) {
    return cleaned;
  }

  return '';
};

// /**
//  * Sanitizes and normalizes amount input:
//  * - Allows digits and a single decimal point
//  * - Removes leading zeros unless it's "0" or "0.xxx"
//  * - Preserves trailing decimal (e.g. "12." or "12.0")
//  *
//  * @param {string} value
//  * @returns {string}
//  */
// export const sanitizeAmount = value => {
//   if (typeof value !== 'string') {
//     return '';
//   }

//   // Remove invalid characters (keep digits and .)
//   let cleaned = value.replace(/[^0-9.]/g, '');

//   // Allow only one decimal point
//   const parts = cleaned.split('.');
//   if (parts.length > 2) {
//     cleaned = parts[0] + '.' + parts.slice(1).join('');
//   }

//   // Remove leading zeros unless "0" or "0.xxx"
//   cleaned = cleaned.replace(/^0+(?!\.)/, '');

//   // Prevent input starting with a decimal (e.g., ".5" => "0.5")
//   if (cleaned.startsWith('.')) {
//     cleaned = '0' + cleaned;
//   }

//   return cleaned;
// };

export const formatInputDate = input => {
  // Remove non-digit characters
  const cleaned = input.replace(/[^\d]/g, '');

  let day = cleaned.slice(0, 2);
  let month = cleaned.slice(2, 4);
  let year = cleaned.slice(4, 8);

  // Pad single digit day/month with leading zero
  if (day.length === 1 && parseInt(day) > 3) {
    day = '0' + day;
  }
  if (month.length === 1 && parseInt(month) > 1) {
    month = '0' + month;
  }

  let formatted = day;
  if (month.length > 0) {
    formatted += '/' + month;
  }
  if (year.length > 0) {
    formatted += '/' + year;
  }

  return formatted;
};

export const isValidInput = input => {
  // Allow only numbers and slashes
  return /^[0-9/]*$/.test(input);
};

function validateDate(trimmedValue, key) {
  if (trimmedValue === '') {
    return 'Please enter a valid date';
  }

  const parts = trimmedValue.split('/');
  if (parts.length !== 3) {
    return 'Please enter a valid date in dd/mm/yyyy format';
  }

  const [ddStr, mmStr, yyyyStr] = parts;

  if (yyyyStr.length !== 4 || isNaN(yyyyStr)) {
    return 'Please enter a 4-digit year';
  }

  const dd = Number(ddStr);
  const mm = Number(mmStr);
  const yyyy = Number(yyyyStr);

  const currentYear = new Date().getFullYear();
  if (yyyy < 1900) {
    return 'Please enter a valid year';
  }

  const date = new Date(yyyy, mm - 1, dd);
  const isValid =
    date.getFullYear() === yyyy &&
    date.getMonth() === mm - 1 &&
    date.getDate() === dd;

  if (!isValid) {
    return 'Please enter a valid date';
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const inputDate = new Date(yyyy, mm - 1, dd);

  if (key === 'dob') {
    if (inputDate.getTime() === today.getTime()) {
      return 'Date of birth cannot be today';
    }

    if (inputDate > today) {
      return 'Date of birth cannot be in the future';
    }

    // ✅ Optional: Minimum age check (e.g., 18 years)
    // const age = currentYear - yyyy;
    // if (age < 18) {
    //   return 'You must be at least 18 years old';
    // }
  }

  return ''; // ✅ All good
}
