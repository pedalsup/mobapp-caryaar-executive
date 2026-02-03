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

export const CLEAR_LOAN_SEARCH = 'CLEAR_LOAN_SEARCH';
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS';
export const CLEAR_PARTNER_FORM = 'CLEAR_PARTNER_FORM';
export const RESET_REGISTRATION = 'RESET_REGISTRATION';
export const REMOVE_SALES_EXECUTIVE = 'REMOVE_SALES_EXECUTIVE';

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
export const FETCH_PARTNERS = createAsyncActionTypes('FETCH_PARTNERS');

export const FETCH_PARTNER_BY_ID = createAsyncActionTypes(
  'FETCH_PARTNER_BY_ID',
);

export const CREATE_PARTNER = createAsyncActionTypes('CREATE_PARTNER');

export const CLEAR_SEARCH_RESULTS = createAsyncActionTypes(
  'CLEAR_SEARCH_RESULTS',
);

export const FETCH_LOAN_APPLICATIONS = createAsyncActionTypes(
  'FETCH_LOAN_APPLICATIONS',
);

export const FETCH_LOAN_APPLICATION_BY_ID = createAsyncActionTypes(
  'FETCH_LOAN_APPLICATION_BY_ID',
);

export const FETCH_PARTNER_PERFORMANCES = createAsyncActionTypes(
  'FETCH_PARTNER_PERFORMANCES',
);

export const FETCH_PARTNER_STATS = createAsyncActionTypes(
  'FETCH_PARTNER_STATS',
);

export const FETCH_NOTIFICATIONS = createAsyncActionTypes(
  'FETCH_NOTIFICATIONS',
);

export const MARK_ALL_NOTIFICATIONS_READ = createAsyncActionTypes(
  'MARK_ALL_NOTIFICATIONS_READ',
);

export const FETCH_SALES_EXECUTIVES = createAsyncActionTypes(
  'FETCH_SALES_EXECUTIVES',
);

export const ADD_SALES_EXECUTIVE = createAsyncActionTypes(
  'ADD_SALES_EXECUTIVE',
);

export const REMOVE_SALES_EXECUTIVE_BY_ID = createAsyncActionTypes(
  'REMOVE_SALES_EXECUTIVE_BY_ID',
);
