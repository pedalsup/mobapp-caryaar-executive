import {
  fetchLoanApplicationById,
  fetchLoanApplications,
  searchLoanApplicationByKeyword,
} from '../../services';
import {showApiErrorToast} from '../../utils/helper';
import {
  CLEAR_LOAN_SEARCH,
  FETCH_LOAN_APPLICATION_BY_ID,
  FETCH_LOAN_APPLICATIONS,
  RESET_LOAN_APPLICATION,
  SET_LOAN_FILTER_VALUE,
} from './actionType';

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
    dispatch({type: FETCH_LOAN_APPLICATIONS.REQUEST});

    try {
      const response = await fetchLoanApplications(page, limit, payload);
      const isSearch = payload?.params?.search;
      const applications = response.data || [];

      dispatch({
        type: FETCH_LOAN_APPLICATIONS.SUCCESS,
        payload: {
          applications,
          pagination: response.pagination,
          isSearch,
        },
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: FETCH_LOAN_APPLICATIONS.FAILURE,
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
    dispatch({type: FETCH_LOAN_APPLICATION_BY_ID.REQUEST});

    try {
      const response = await fetchLoanApplicationById(id);
      dispatch({
        type: FETCH_LOAN_APPLICATION_BY_ID.SUCCESS,
        payload: response.data?.[0],
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: FETCH_LOAN_APPLICATION_BY_ID.FAILURE,
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
  type: CLEAR_LOAN_SEARCH,
});

export const resetLoanApplication = () => ({
  type: RESET_LOAN_APPLICATION.SUCCESS,
});

export const setLoanFilterFromHomePage = value => ({
  type: SET_LOAN_FILTER_VALUE.SUCCESS,
  payload: value,
});
