import axiosInstance from '../networking/axiosInstance';
import {endpoints} from './endpoints';

/**
 * Fetches loan tracking details for a given application ID.
 *
 * @async
 * @function fetchLoanTrackingDetailsByAppId
 * @param {string|number} applicationId - Unique identifier of the loan application.
 * @returns {Promise<Object>} Resolves with the loan tracking details response data.
 * @throws {Error} Throws an error if the API request fails.
 */
export const fetchLoanTrackingDetailsByAppId = async applicationId => {
  try {
    const response = await axiosInstance.get(
      endpoints.LOAN.TRACKING(applicationId),
    );
    return response.data;
  } catch (error) {
    console.error('Error setting partner and sales executive:', error);
    throw error;
  }
};
