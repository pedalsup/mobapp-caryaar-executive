import types from './types';
import {
  deleteSalesExecutiveById,
  fetchSalesExecutives,
  createSalesExecutive,
} from '../../services';
import {
  getErrorMessage,
  showApiErrorToast,
  showApiSuccessToast,
  showToast,
} from '../../utils/helper';
import {
  ADD_SALES_EXECUTIVE,
  FETCH_SALES_EXECUTIVES,
  REMOVE_SALES_EXECUTIVE,
  REMOVE_SALES_EXECUTIVE_BY_ID,
} from './actionType';

/**
 * Action creator to reset the state of sales executives.
 *
 * @returns {Object} The action object to be dispatched.
 * @property {string} type - The action type, which will be `RESET_SALES_EXECUTIVE`.
 */
export const resetSalesExecutive = () => ({
  type: types.RESET_SALES_EXECUTIVE,
});

/**
 * Thunk action to fetch sales executives with pagination.
 *
 * @param {number} page - The page number to fetch.
 * @param {number} limit - The number of items per page.
 * @param {Function} onSuccess - Callback function to execute on successful fetch.
 * @param {Function} onFailure - Callback function to execute on failed fetch.
 * @returns {Function} A thunk that dispatches actions based on API response.
 */
export const fetchSalesExecutivesThunk = (
  page,
  limit,
  onSuccess,
  onFailure,
) => {
  return async dispatch => {
    dispatch({type: FETCH_SALES_EXECUTIVES.REQUEST});

    try {
      const response = await fetchSalesExecutives(
        `page=${page}&limit=${limit}`,
      );
      dispatch({
        type: FETCH_SALES_EXECUTIVES.SUCCESS,
        payload: {
          data: response.data,
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.total,
          totalPages: response.pagination.totalPages,
        },
      });

      onSuccess?.(response);
    } catch (error) {
      showApiErrorToast(error);
      dispatch({
        type: FETCH_SALES_EXECUTIVES.FAILURE,
        payload: {
          message: getErrorMessage(error),
          success: false,
        },
      });

      onFailure?.(error.message);
    }
  };
};

/**
 * Thunk action to delete a sales executive by ID.
 *
 * @param {string} partnerId - The ID of the sales executive to delete.
 * @param {Function} onSuccess - Callback function to execute on successful deletion.
 * @param {Function} onFailure - Callback function to execute on failed deletion.
 * @returns {Function} A thunk that dispatches actions based on API response.
 */
export const deleteSalesExecutiveByIdThunk = (
  partnerId,
  onSuccess,
  onFailure,
) => {
  return async dispatch => {
    dispatch({type: REMOVE_SALES_EXECUTIVE_BY_ID.REQUEST});
    try {
      const response = await deleteSalesExecutiveById(partnerId);
      dispatch({
        type: REMOVE_SALES_EXECUTIVE_BY_ID.SUCCESS,
        payload: response,
      });
      dispatch({
        type: REMOVE_SALES_EXECUTIVE,
        payload: partnerId,
      });
      onSuccess?.(response);
      showApiSuccessToast(response);
    } catch (error) {
      showApiErrorToast(error);
      dispatch({
        type: REMOVE_SALES_EXECUTIVE_BY_ID.FAILURE,
        payload: error.message,
      });
      onFailure?.(error.message);
    }
  };
};

/**
 * Thunk action to create a new sales executive.
 *
 * @param {Object} param - The parameters for creating a new sales executive.
 * @param {Function} onSuccess - Callback function to execute on successful creation.
 * @param {Function} onFailure - Callback function to execute on failed creation.
 * @returns {Function} A thunk that dispatches actions based on API response.
 */
export const createSalesExecutiveThunk = (param, onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: ADD_SALES_EXECUTIVE.REQUEST});

    try {
      const response = await createSalesExecutive(param);

      dispatch({
        type: ADD_SALES_EXECUTIVE.SUCCESS,
        payload: {
          id: response.data?.id,
          userId: response.data?.userId,
          position: param.position,
          user: {
            id: response.data?.userId,
            email: param.email,
            mobileNumber: param.mobileNumber,
            password: null,
            name: param.name,
            role: 'SALES_EXECUTIVE',
          },
          message: response.message,
          success: response.success,
        },
      });

      showToast('success', response?.message || 'Member created successfully!');

      onSuccess?.(response);
    } catch (error) {
      showApiErrorToast(error);
      dispatch({
        type: ADD_SALES_EXECUTIVE.FAILURE,
        payload: {
          message: getErrorMessage(error),
          success: false,
        },
      });

      onFailure?.(error);
    }
  };
};
