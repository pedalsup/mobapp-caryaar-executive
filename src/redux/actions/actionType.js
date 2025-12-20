// actionTypes.js

/**
 * Creates a set of async action types (REQUEST, SUCCESS, FAILURE) for a given base name.
 * @param {string} base - The base name for the action (e.g. 'VEHICLE')
 * @returns {{REQUEST: string, SUCCESS: string, FAILURE: string}}
 */
export const createAsyncActionTypes = base => ({
  REQUEST: `${base}_REQUEST`,
  SUCCESS: `${base}_SUCCESS`,
  FAILURE: `${base}_FAILURE`,
});

export const SET_IS_EXISTING_PARTNER = createAsyncActionTypes(
  'SET_IS_EXISTING_PARTNER',
);

export const RESET_LOAN_APPLICATION = createAsyncActionTypes(
  'RESET_LOAN_APPLICATION',
);
export const SET_LOAN_FILTER_VALUE = createAsyncActionTypes(
  'SET_LOAN_FILTER_VALUE',
);
export const SET_PARTNER_ACTIVE_TAB = createAsyncActionTypes(
  'SET_PARTNER_ACTIVE_TAB',
);
