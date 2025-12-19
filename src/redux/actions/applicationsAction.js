import {
  fetchLoanApplicationById,
  fetchLoanApplications,
  searchLoanApplicationByKeyword,
} from '../../services';
import {showApiErrorToast} from '../../utils/helper';
import {RESET_LOAN_APPLICATION, SET_LOAN_FILTER_VALUE} from './actionType';
import types from './types';

/**
 * Thunk to fetch a paginated list of loan applications.
 *
 * @param {number} page - The current page number (default is 1).
 * @param {number} limit - The number of items per page (default is 10).
 * @param {Function} [onSuccess] - Optional callback to execute on success. Receives full response.
 * @param {Function} [onFailure] - Optional callback to execute on failure. Receives error message.
 * @returns {Function} Redux thunk function.
 */
export const fetchLoanApplicationsThunk = (
  page = 1,
  limit = 10,
  payload = {},
  onSuccess,
  onFailure,
) => {
  return async dispatch => {
    dispatch({type: types.FETCH_LOAN_APPLICATIONS_REQUEST});

    try {
      const response = await fetchLoanApplications(page, limit, payload);
      const isSearch = payload?.params?.search;
      const applications = response.data || [];

      dispatch({
        type: types.FETCH_LOAN_APPLICATIONS_SUCCESS,
        payload: {
          applications,
          pagination: response.pagination,
          isSearch,
        },
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: types.FETCH_LOAN_APPLICATIONS_FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Thunk to fetch a specific loan application by its ID.
 *
 * @param {string} id - The unique identifier of the loan application.
 * @param {Function} [onSuccess] - Optional callback to execute on success. Receives full response.
 * @param {Function} [onFailure] - Optional callback to execute on failure. Receives error message.
 * @returns {Function} Redux thunk function.
 */
export const fetchLoanApplicationFromIdThunk = (id, onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: types.FETCH_LOAN_APPLICATIONS_REQUEST});

    try {
      const response = await fetchLoanApplicationById(id);
      dispatch({
        type: types.FETCH_LOAN_APPLICATIONS_BY_ID_SUCCESS,
        payload: response.data?.[0],
      });
      console.log('response---->', JSON.stringify(response));
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: types.FETCH_LOAN_APPLICATIONS_FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};
/**
 * Thunk action to search for loan applications based on a keyword and optional status.
 *
 * @function searchLoanApplicationThunk
 * @param {string} search - The search keyword.
 * @param {number} [page=1] - The current page number for pagination.
 * @param {number} [limit=10] - The number of items per page.
 * @param {Function} [onSuccess] - Callback to invoke on successful API response.
 * @param {Function} [onFailure] - Callback to invoke on failed API response.
 * @param {string|null} [status=null] - Optional loan application status to filter results.
 * @returns {Function} Thunk function that dispatches Redux actions.
 */
export const searchLoanApplicationThunk = (
  search,
  page = 1,
  limit = 10,
  onSuccess,
  onFailure,
  status = null,
) => {
  return async dispatch => {
    dispatch({type: types.SEARCH_LOAN_APPLICATIONS_REQUEST});
    try {
      const response = await searchLoanApplicationByKeyword(
        search,
        page,
        limit,
        status,
      );

      dispatch({
        type: types.SEARCH_LOAN_APPLICATIONS_SUCCESS,
        payload: {
          data: response.data,
          message: response.message,
          success: response.success,
          page: response.pagination.page,
          totalPages: response.pagination.totalPages,
        },
      });

      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: types.SEARCH_LOAN_APPLICATIONS_FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Clears the loan application search results from the Redux store.
 *
 * @function clearLoanSearch
 * @returns {Object} Redux action to clear the search results.
 */
export const clearLoanSearch = () => ({
  type: types.CLEAR_LOAN_SEARCH,
});

export const resetLoanApplication = () => ({
  type: RESET_LOAN_APPLICATION.SUCCESS,
});

export const setLoanFilterFromHomePage = value => ({
  type: SET_LOAN_FILTER_VALUE.SUCCESS,
  payload: value,
});
