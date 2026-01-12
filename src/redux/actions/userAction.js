import {
  changeUserPassword,
  getUserProfile,
  loginWithType,
  updateUserProfile,
} from '../../services';
import {showApiErrorToast, showApiSuccessToast} from '../../utils/helper';
import types from './types';

/**
 * Action creator to set the user details in the Redux store.
 *
 * @param {Object} details - The user details to set in the store.
 * @returns {Object} The action object to be dispatched.
 * @property {string} type - The action type, which will be `SET_USER_DETAILS`.
 * @property {Object} payload - The user details.
 */
export const setUserDetails = details => ({
  type: types.SET_USER_DETAILS,
  payload: details,
});

/**
 * Action creator to set the user profile in the Redux store.
 *
 * @param {Object} profile - The user profile to set in the store.
 * @returns {Object} The action object to be dispatched.
 * @property {string} type - The action type, which will be `SET_USER_PROFILE`.
 * @property {Object} payload - The user profile.
 */
export const setUserProfile = profile => ({
  type: types.SET_USER_PROFILE,
  payload: profile,
});

/**
 * Action creator to clear the user details from the Redux store.
 *
 * @returns {Object} The action object to be dispatched.
 * @property {string} type - The action type, which will be `CLEAR_USER_DETAILS`.
 */
export const clearUserDetails = () => ({
  type: types.CLEAR_USER_DETAILS,
});

/**
 * Action creator to update a specific user detail field.
 *
 * @param {string} key - The key of the user detail to update.
 * @param {any} value - The new value for the user detail field.
 * @returns {Object} The action object to be dispatched.
 * @property {string} type - The action type, which will be `UPDATE_USER_DETAIL_FIELD`.
 * @property {Object} payload - The key-value pair of the user detail to update.
 */
export const updateUserDetailField = (key, value) => ({
  type: types.UPDATE_USER_DETAIL_FIELD,
  payload: {key, value},
});

/**
 * Thunk action to fetch the current user's profile.
 *
 * Dispatches request, success, or failure actions based on the API response.
 * Optionally executes provided callbacks on success or failure.
 *
 * @param {Function} [onSuccess] - Callback to be executed after successful fetch.
 * @param {Function} [onFailure] - Callback to be executed on fetch failure.
 * @returns {Function} Thunk function to be dispatched by Redux.
 */
export const fetchUser = (onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: types.FETCH_USER_REQUEST});

    try {
      const response = await getUserProfile();
      dispatch({
        type: types.FETCH_USER_SUCCESS,
        payload: {
          data: response?.data,
        },
      });

      onSuccess?.(response?.data);
    } catch (error) {
      dispatch({
        type: types.FETCH_USER_FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error);
    }
  };
};

/**
 * Thunk action for user login with a specified login type.
 *
 * Dispatches actions based on the success or failure of the login attempt.
 * On success, it returns the success message and any relevant data.
 * On failure, it shows an error toast and dispatches failure action.
 *
 * @param {string} type - The type of login (e.g., email, phone).
 * @param {Object} param - The login parameters (credentials) to use.
 * @param {Function} onSuccess - Callback function to be executed on successful login.
 * @param {Function} onFailure - Callback function to be executed on failed login.
 * @returns {Function} A thunk that dispatches actions based on the API response.
 */
export const userLoginThunk = (type, param, onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: types.USER_LOADING});
    try {
      const response = await loginWithType(type, param);
      dispatch({
        type: types.USER_SUCCESS,
        payload: {
          message: response.message,
          success: response.success,
        },
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: types.USER_FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Thunk action to update the user profile.
 *
 * Dispatches actions based on the success or failure of the profile update.
 * On success, it returns the success message.
 * On failure, it shows an error toast and dispatches failure action.
 *
 * @param {Object} param - The parameters to update the user profile with.
 * @param {Function} onSuccess - Callback function to be executed on successful update.
 * @param {Function} onFailure - Callback function to be executed on failed update.
 * @returns {Function} A thunk that dispatches actions based on the API response.
 */
export const updateProfileThunk = (param, onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: types.USER_LOADING});
    try {
      const response = await updateUserProfile(param);
      dispatch({
        type: types.UPDATE_USER_SUCCESS,
        payload: {
          message: response?.message,
          success: response?.success,
          data: response?.data,
        },
      });
      if (response?.success) {
        showApiSuccessToast(response);
      }
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: types.UPDATE_USER_FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Thunk action to change the user's password.
 *
 * Dispatches actions based on the success or failure of the password change.
 * On success, it returns the success message.
 * On failure, it shows an error toast and dispatches failure action.
 *
 * @param {Object} param - The parameters for changing the user's password.
 * @param {Function} onSuccess - Callback function to be executed on successful password change.
 * @param {Function} onFailure - Callback function to be executed on failed password change.
 * @returns {Function} A thunk that dispatches actions based on the API response.
 */
export const changePasswordThunk = (param, onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: types.CHANGE_PASSWORD_REQUEST});
    try {
      const response = await changeUserPassword(param);
      dispatch({
        type: types.CHANGE_PASSWORD_SUCCESS,
        payload: {
          message: response.message,
          success: response.success,
        },
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: types.CHANGE_PASSWORD_FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};
