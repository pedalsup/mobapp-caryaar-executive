import {fetchPartnerPerformances, fetchPartnerStats} from '../../services';
import {showApiErrorToast} from '../../utils/helper';
import {FETCH_PARTNER_PERFORMANCES, FETCH_PARTNER_STATS} from './actionType';
import types from './types';

/**
 * Thunk action to fetch partner performance data from the backend.
 *
 * Dispatches request, success, and failure actions.
 * Optionally calls provided onSuccess or onFailure callbacks.
 *
 * @function fetchPartnerPerformancesThunk
 * @param {function} [onSuccess] - Callback to execute if the API call succeeds.
 * @param {function} [onFailure] - Callback to execute if the API call fails.
 * @returns {Function} Thunk function for Redux dispatch.
 */
export const fetchPartnerPerformancesThunk = (onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: FETCH_PARTNER_PERFORMANCES.REQUEST});

    try {
      const response = await fetchPartnerPerformances();
      dispatch({
        type: FETCH_PARTNER_PERFORMANCES.SUCCESS,
        payload: {
          data: response.data,
        },
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: FETCH_PARTNER_PERFORMANCES.FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Thunk action to fetch partner performance statistics.
 *
 * Dispatches request, success, and failure actions.
 * Optionally calls provided onSuccess or onFailure callbacks.
 *
 * @function fetchPartnerStatsThunk
 * @param {function} [onSuccess] - Callback for success response.
 * @param {function} [onFailure] - Callback for error response.
 * @returns {Function} Thunk function for Redux dispatch.
 */
export const fetchPartnerStatsThunk = (onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: FETCH_PARTNER_STATS.REQUEST});

    try {
      const response = await fetchPartnerStats();
      dispatch({
        type: FETCH_PARTNER_STATS.SUCCESS,
        payload: {
          data: response.data,
        },
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: FETCH_PARTNER_STATS.FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};
