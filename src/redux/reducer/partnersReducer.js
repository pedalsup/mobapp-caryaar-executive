import {PARTNER_TAB_OPTIONS} from '../../constants/enums';
import {types} from '../actions';
import {
  CLEAR_SEARCH_RESULTS,
  CREATE_PARTNER,
  FETCH_PARTNER_BY_ID,
  FETCH_PARTNERS,
  SET_IS_EXISTING_PARTNER,
  SET_PARTNER_ACTIVE_TAB,
} from '../actions/actionType';

const initialState = {
  loading: false,
  partnersList: [],
  success: false,
  selectedPartner: {},
  searchPartners: [],
  currentPage: 1,
  totalPages: 0, //1
  activePartners: [],
  pendingPartners: [],
  activePage: 1,
  activeTotalPages: 0, // 1
  pendingPage: 0, // 1
  pendingTotalPages: 0, // 1
  searchPage: 0, // 1
  searchTotalPages: 0, // 1
  selectedPartnerId: null,
  isExistingPartner: false,
  activeTab: PARTNER_TAB_OPTIONS[0],
  totalPage: 1,
  page: 1,
};

const partnersReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_PARTNER.REQUEST:
    case types.UPDATE_PARTNER_REQUEST:
    case FETCH_PARTNER_BY_ID.REQUEST:
    case FETCH_PARTNERS.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_PARTNER_BY_ID.FAILURE:
    case CREATE_PARTNER.FAILURE:
    case types.UPDATE_PARTNER_FAILURE:
    case FETCH_PARTNERS.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case FETCH_PARTNER_BY_ID.SUCCESS:
      return {
        ...state,
        selectedPartner: action.payload,
        selectedPartnerId: action.payload?.id,
        loading: false,
      };
    case types.RESET_PARTNER:
      return {
        ...state,
        selectedPartner: {},
        selectedPartnerId: null,
        loading: false,
      };
    case CREATE_PARTNER.SUCCESS:
      return {
        ...state,
        // partnersList: [action.payload.data, ...state.partnersList],
        message: action.payload.message,
        success: action.payload.success,
        loading: false,
      };
    case types.UPDATE_PARTNER_SUCCESS:
      return {
        ...state,
        selectedPartner: action.payload.data,
        message: action.payload.message,
        success: action.payload.success,
        loading: false,
      };

    case CLEAR_SEARCH_RESULTS.SUCCESS:
      return {
        ...state,
        searchPartners: [],
        searchPage: 1,
        searchTotalPages: 1,
        loading: false,
      };

    case SET_IS_EXISTING_PARTNER.SUCCESS:
      return {...state, isExistingPartner: action.payload};

    case SET_PARTNER_ACTIVE_TAB.SUCCESS:
      return {...state, activeTab: action.payload};

    case FETCH_PARTNERS.SUCCESS:
      const {
        applications,
        pagination: {page, totalPages},
        isSearch,
        isPending,
      } = action.payload;

      if (isSearch) {
        return {
          ...state,
          loading: false,
          searchPage: page,
          searchTotalPages: totalPages,
          searchPartners:
            page > 1
              ? [...state.searchPartners, ...applications]
              : applications,
        };
      }
      if (isPending) {
        return {
          ...state,
          loading: false,
          pendingPartners:
            page > 1
              ? [...state.pendingPartners, ...applications]
              : applications,
          page,
          totalPage: totalPages,
        };
      } else {
        return {
          ...state,
          loading: false,
          activePartners:
            page > 1
              ? [...state.activePartners, ...applications]
              : applications,
          page,
          totalPage: totalPages,
        };
      }

    case types.RESET_APP_STATE:
      return initialState;
    default:
      return state;
  }
};

export default partnersReducer;
