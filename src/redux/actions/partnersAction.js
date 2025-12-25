import moment from 'moment';
import {
  createPartner,
  fetchPartnerById,
  fetchPartners,
  updatePartnerById,
} from '../../services';
import {showApiErrorToast} from '../../utils/helper';
import {formatPartnerDetails} from '../../utils/partnerHelpers';
import {
  CLEAR_SEARCH_RESULTS,
  CREATE_PARTNER,
  FETCH_PARTNER_BY_ID,
  FETCH_PARTNERS,
  SET_IS_EXISTING_PARTNER,
  SET_PARTNER_ACTIVE_TAB,
} from './actionType';
import {
  setBankingDetails,
  setBasicDetails,
  setDealershipType,
  setDocumentDetails,
  setLocationDetails,
  setPartnerRole,
  setSellerType,
  setUserType,
} from './partnerFormActions';
import types from './types';

/**
 * Thunk to fetch a specific partner's details by ID.
 *
 * @param {string} partnerId - The ID of the partner to fetch.
 * @param {Function} [onSuccess] - Callback executed when the fetch is successful.
 * @param {Function} [onFailure] - Callback executed when the fetch fails.
 */
export const fetchPartnerFromId = (partnerId, onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: FETCH_PARTNER_BY_ID.REQUEST});

    try {
      const response = await fetchPartnerById(partnerId);
      const partnerData = response.data;

      const {
        basicDetails,
        locationDetails,
        bankingDetails,
        sellerType,
        partnerType,
        isMultiUser,
        partnerRole,
      } = formatPartnerDetails(partnerData);

      dispatch(setSelectedPartner(partnerData));
      dispatch(setUserType(isMultiUser));
      dispatch(setPartnerRole(partnerRole));
      dispatch(setDealershipType(partnerType));
      dispatch(setSellerType(sellerType));
      dispatch(setBasicDetails(basicDetails));
      dispatch(setLocationDetails(locationDetails));
      dispatch(setBankingDetails(bankingDetails));
      dispatch(setDocumentDetails(partnerData?.documents));

      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: FETCH_PARTNER_BY_ID.FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Thunk to create a new partner.
 *
 * @param {Object} param - Data used to create the partner.
 * @param {Function} [onSuccess] - Callback executed after successful creation.
 * @param {Function} [onFailure] - Callback executed if creation fails.
 */
export const createPartnerThunk = (param, onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: CREATE_PARTNER.REQUEST});

    try {
      const response = await createPartner(param);
      dispatch({
        type: CREATE_PARTNER.SUCCESS,
        payload: {
          data: {
            id: response.data?.partnerId,
            createdAt: moment().toISOString(),
            companyName: param.companyName,
          },
          message: response.message,
          success: response.success,
        },
      });

      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: CREATE_PARTNER.FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Thunk to update an existing partner by ID.
 *
 * @param {string} partnerID - The ID of the partner to update.
 * @param {Object} param - Updated partner data.
 * @param {Function} [onSuccess] - Callback executed after successful update.
 * @param {Function} [onFailure] - Callback executed if update fails.
 */
export const updatePartnerThunk = (partnerID, param, onSuccess, onFailure) => {
  return async dispatch => {
    dispatch({type: types.UPDATE_PARTNER_REQUEST});

    try {
      const response = await updatePartnerById(param, partnerID);
      dispatch({
        type: types.UPDATE_PARTNER_SUCCESS,
        payload: {
          data: response.data,
          message: response.message,
          success: response.success,
        },
      });

      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: types.UPDATE_PARTNER_FAILURE,
        payload: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

export const fetchPartnersThunk = (
  page = 1,
  limit = 10,
  payload = {},
  onSuccess,
  onFailure,
) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCH_PARTNERS.REQUEST});

    const safePayload = {
      params: payload?.params ?? {},
    };

    try {
      const response = await fetchPartners(page, limit, safePayload);

      const isSearch = !!safePayload.params.search;
      const isPending = safePayload.params.onboardingStatus === 'PENDING';

      dispatch({
        type: FETCH_PARTNERS.SUCCESS,
        payload: {
          applications: response?.data ?? [],
          pagination: response?.pagination ?? {},
          isSearch,
          isPending,
        },
      });
      onSuccess?.(response);
    } catch (error) {
      dispatch({
        type: FETCH_PARTNERS.FAILURE,
        error: error.message,
      });
      showApiErrorToast(error);
      onFailure?.(error.message);
    }
  };
};

/**
 * Action creator to clear the search results.
 *
 * This action is dispatched to reset the state of search results in the Redux store.
 * It will set the search results to an empty state, effectively clearing any data
 * that was previously stored in the search results state.
 *
 * @returns {Object} The action object to be dispatched.
 * @property {string} type - The action type, which will be `CLEAR_SEARCH_RESULTS.SUCCESS`.
 */
export const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS.SUCCESS,
});

/**
 * Action creator to set the selected partner data in the Redux store.
 *
 * @function
 * @param {Object} partnerData - The partner object to store.
 * @returns {Object} Redux action with type `FETCH_PARTNER_BY_ID.SUCCESS` and the provided partner data as payload.
 */
export const setSelectedPartner = partnerData => ({
  type: FETCH_PARTNER_BY_ID.SUCCESS,
  payload: partnerData,
});

/**
 * Action creator to reset all partner details in the Redux store.
 *
 * Typically dispatched when leaving or resetting the partner form view.
 *
 * @returns {Object} Redux action with type `RESET_PARTNER`.
 */
export const resetPartnerDetail = () => ({
  type: types.RESET_PARTNER,
});

export const setIsExistingPartner = isExisting => ({
  type: SET_IS_EXISTING_PARTNER.SUCCESS,
  payload: isExisting,
});

export const setPartnerActiveTab = activeTab => ({
  type: SET_PARTNER_ACTIVE_TAB.SUCCESS,
  payload: activeTab,
});
