import axiosInstance from '../networking/axiosInstance';
import {endpoints} from './endpoints';

/**
 * Fetches all notifications.
 *
 * @async
 * @function fetchNotifications
 * @returns {Promise<Object>} Notifications list
 * @throws Will throw an error if the request fails
 */
export const fetchNotifications = async () => {
  try {
    const response = await axiosInstance.get(endpoints.NOTIFICATIONS.LIST);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch notifications', error);
    throw error;
  }
};

/**
 * Marks all notifications as read.
 *
 * @async
 * @function markAllNotificationsRead
 * @returns {Promise<Object>} Response data from the server
 * @throws {Error} Throws an error if the API request fails
 */
export const markAllNotificationsRead = async () => {
  try {
    const response = await axiosInstance.patch(
      endpoints.NOTIFICATIONS.READ_ALL,
    );
    return response.data;
  } catch (error) {
    console.error('Failed to mark notifications as read', error);
    throw error;
  }
};
