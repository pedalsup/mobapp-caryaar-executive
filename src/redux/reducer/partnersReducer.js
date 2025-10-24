import {types} from '../actions';
import {SET_IS_EXISTING_PARTNER} from '../actions/actionType';

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
};

const partnersReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_PARTNERS_REQUEST:
    case types.CREATE_PARTNER_REQUEST:
    case types.UPDATE_PARTNER_REQUEST:
    case types.SEARCH_PARTNER_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case types.FETCH_PARTNER_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.FETCH_PARTNERS_FAILURE:
    case types.FETCH_PARTNER_FAILURE:
    case types.CREATE_PARTNER_FAILURE:
    case types.UPDATE_PARTNER_FAILURE:
    case types.SEARCH_PARTNER_FAILURE:
      return {
        ...state,
        loading: false,
      };
    case types.FETCH_PARTNERS_SUCCESS:
      return {
        ...state,
        partnersList:
          action.payload.page === 1
            ? action.payload.data
            : [...state.partnersList, ...action.payload.data],
        currentPage: action.payload.page,
        totalPages: action.payload.totalPages,
        loading: false,
      };

    case types.FETCH_PARTNER_SUCCESS:
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
    case types.CREATE_PARTNER_SUCCESS:
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
    case types.SEARCH_PARTNER_SUCCESS:
      return {
        ...state,
        searchPartners:
          action.payload.page === 1
            ? action.payload.data
            : [...state.searchPartners, ...action.payload.data],
        loading: false,
        message: action.payload.message,
        success: action.payload.success,
        searchPage: action.payload.page,
        searchTotalPages: action.payload.totalPages,
      };

    case types.FETCH_ACTIVE_PARTNERS_REQUEST:
      return {...state, loading: true};

    case types.FETCH_ACTIVE_PARTNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        activePartners:
          action.payload.page === 1
            ? action.payload.data
            : [...state.activePartners, ...action.payload.data],
        activePage: action.payload.page,
        activeTotalPages: action.payload.totalPages,
      };

    case types.FETCH_PENDING_PARTNERS_REQUEST:
      return {...state, loading: true};

    case types.FETCH_PENDING_PARTNERS_SUCCESS:
      return {
        ...state,
        loading: false,
        pendingPartners:
          action.payload.page === 1
            ? action.payload.data
            : [...state.pendingPartners, ...action.payload.data],
        pendingPage: action.payload.page,
        pendingTotalPages: action.payload.totalPages,
      };

    case types.FETCH_ACTIVE_PARTNERS_FAILURE:
    case types.FETCH_PENDING_PARTNERS_FAILURE:
      return {...state, loading: false};
    case types.CLEAR_SEARCH_PARTNERS:
      return {
        ...state,
        searchPartners: [],
        searchPage: 1,
        searchTotalPages: 1,
        loading: false,
      };

    case SET_IS_EXISTING_PARTNER.SUCCESS:
      return {...state, isExistingPartner: action.payload};

    case types.RESET_APP_STATE:
      return initialState;
    default:
      return state;
  }
};

export default partnersReducer;
