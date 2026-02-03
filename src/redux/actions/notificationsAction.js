import {fetchNotifications, markAllNotificationsRead} from '../../services';
import {showApiErrorToast} from '../../utils/helper';
import {
  CLEAR_NOTIFICATIONS,
  FETCH_NOTIFICATIONS,
  MARK_ALL_NOTIFICATIONS_READ,
} from './actionType';

/**
 * Thunk to fetch notifications.
 *
 * @function fetchNotificationsThunk
 * @param {Function} [onSuccess] - Callback invoked with response on success.
 * @param {Function} [onFailure] - Callback invoked with error message on failure.
 * @returns {Function} Thunk function to dispatch Redux actions.
 */
export const fetchNotificationsThunk = (onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: FETCH_NOTIFICATIONS.REQUEST});

    try {
      const response = await fetchNotifications();
      dispatch({
        type: FETCH_NOTIFICATIONS.SUCCESS,
        payload: response,
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: FETCH_NOTIFICATIONS.FAILURE,
        payload: error,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Action to clear all notifications from Redux store.
 *
 * @function clearNotifications
 * @returns {Object} Redux action with type `CLEAR_NOTIFICATIONS`
 */
export const clearNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
});

/**
 * Thunk to mark all notifications as read.
 *
 * @function markAllNotificationsReadThunk
 * @param {Function} [onSuccess] - Callback invoked after successful operation.
 * @param {Function} [onFailure] - Callback invoked with error message on failure.
 * @returns {Function} Thunk function to dispatch Redux actions.
 */
export const markAllNotificationsReadThunk = (onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: MARK_ALL_NOTIFICATIONS_READ.REQUEST});

    try {
      const response = await markAllNotificationsRead();
      dispatch({
        type: MARK_ALL_NOTIFICATIONS_READ.SUCCESS,
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: MARK_ALL_NOTIFICATIONS_READ.FAILURE,
        payload: error,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};
