import {CLEAR_PARTNER_FORM, RESET_REGISTRATION} from './actionType';
import types from './types';

/**
 * Sets the basic partner details (e.g., business name, owner info).
 *
 * @param {Object} payload - Basic details object.
 * @returns {Object} Redux action.
 */
export const setBasicDetails = payload => ({
  type: types.SET_BASIC_DETAILS,
  payload,
});

/**
 * Sets the partner's location information (e.g., address, city).
 *
 * @param {Object} payload - Location details object.
 * @returns {Object} Redux action.
 */
export const setLocationDetails = payload => ({
  type: types.SET_LOCATION_DETAILS,
  payload,
});

/**
 * Sets the partner's uploaded documents.
 *
 * @param {Array|Object} payload - Document details or list.
 * @returns {Object} Redux action.
 */
export const setDocumentDetails = payload => ({
  type: types.SET_DOCUMENT_DETAILS,
  payload,
});

/**
 * Sets the partner's banking details.
 *
 * @param {Object} payload - Banking details object.
 * @returns {Object} Redux action.
 */
export const setBankingDetails = payload => ({
  type: types.SET_BANKING_DETAILS,
  payload,
});

/**
 * Clears all form fields in the partner registration form.
 *
 * @returns {Object} Redux action.
 */
export const clearPartnerForm = () => ({
  type: CLEAR_PARTNER_FORM,
});

/**
 * Sets the dealership type (e.g., Direct Seller, Dealer).
 *
 * @param {string} type - Dealership type.
 * @returns {Object} Redux action.
 */
export const setDealershipType = type => ({
  type: types.SET_DEALERSHIP_TYPE,
  payload: type,
});

/**
 * Sets the user type (e.g., single user or multi-user).
 *
 * @param {boolean} userType - Whether the partner is multi-user.
 * @returns {Object} Redux action.
 */
export const setUserType = userType => ({
  type: types.SET_USER_TYPE,
  payload: userType,
});

/**
 * Sets the seller type (e.g., Individual, Company).
 *
 * @param {string} sellerType - Seller type.
 * @returns {Object} Redux action.
 */
export const setSellerType = sellerType => ({
  type: types.SET_SELLER_TYPE,
  payload: sellerType,
});

/**
 * Sets the partner's role (e.g., Admin, Employee).
 *
 * @param {string} role - Partner role.
 * @returns {Object} Redux action.
 */
export const setPartnerRole = role => ({
  type: types.SET_PARTNER_ROLE,
  payload: role,
});

/**
 * Resets the partner registration process completely.
 *
 * @returns {Object} Redux action.
 */
export const resetRegistration = () => ({
  type: RESET_REGISTRATION,
});
