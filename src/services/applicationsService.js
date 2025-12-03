import axiosInstance from '../networking/axiosInstance';
import {endpoints} from './endpoints';

/**
 * Fetches all loan applications.
 *
 * @async
 * @function fetchLoanApplications
 * @returns {Promise<Object[]>} Array of loan applications
 * @throws Will throw an error if the request fails
 */
export const fetchLoanApplications = async (page = 1, limit = 10) => {
  try {
    const response = await axiosInstance.get(endpoints.LOAN_APPLICATION.LIST, {
      params: {page, limit},
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch loan applications:', error);
    throw error;
  }
};

/**
 * Fetches a specific loan application by ID.
 *
 * @async
 * @function fetchLoanApplicationById
 * @param {string} id - The ID of the loan application
 * @returns {Promise<Object>} Loan application details
 * @throws Will throw an error if the request fails
 */
export const fetchLoanApplicationById = async id => {
  try {
    const response = await axiosInstance.get(
      endpoints.LOAN_APPLICATION.BY_ID(id),
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch loan application with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Searches for loan application using a keyword with optional pagination and status filter.
 *
 * @async
 * @function searchLoanApplicationByKeyword
 * @param {string} search - Keyword used to search partners.
 * @param {number} [page=1] - Page number for pagination.
 * @param {number} [limit=10] - Number of results per page.
 * @param {string|null} [status=null] - Optional onboarding status filter.
 * @returns {Promise<Object>} Resolves with a list of matched partners.
 * @throws {Error} Throws error if the API request fails.
 */
export const searchLoanApplicationByKeyword = async (
  search,
  page = 1,
  limit = 10,
  status = null,
) => {
  try {
    const params = {search, page, limit};
    if (status) {
      params.onboardingStatus = status;
    }
    const response = await axiosInstance.get(endpoints.LOAN_APPLICATION.LIST, {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
