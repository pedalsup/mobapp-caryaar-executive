import {types} from '../actions';
import {
  RESET_LOAN_APPLICATION,
  SET_LOAN_FILTER_VALUE,
} from '../actions/actionType';

const initialState = {
  loading: false,
  loanApplications: [],
  totalPage: 1,
  page: 1,
  searchPage: 1,
  searchTotalPages: 1,
  selectedLoanApplication: null,
  searchedLoanApplications: [],
  selectedApplicationId: null,
  searchApplications: [],
  applications: [],
  loanFilterValue: '',
};

const loanApplicationReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_LOAN_APPLICATIONS_REQUEST:
    case types.SEARCH_LOAN_APPLICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case types.FETCH_LOAN_APPLICATIONS_SUCCESS:
      const {
        applications,
        pagination: {page, totalPages},
        isSearch,
      } = action.payload;

      if (isSearch) {
        return {
          ...state,
          loading: false,
          searchApplications:
            page > 1
              ? [...state.searchApplications, ...applications]
              : applications,
          searchPage: page,
          searchTotalPages: totalPages,
        };
      } else {
        return {
          ...state,
          loading: false,
          applications:
            page > 1 ? [...state.applications, ...applications] : applications,
          page,
          totalPage: totalPages,
        };
      }

    case types.FETCH_LOAN_APPLICATIONS_FAILURE:
    case types.SEARCH_LOAN_APPLICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.FETCH_LOAN_APPLICATIONS_BY_ID_SUCCESS:
      return {
        ...state,
        loading: false,
        selectedLoanApplication: action.payload,
        selectedApplicationId: action.payload?.id,
      };

    case types.SEARCH_LOAN_APPLICATIONS_SUCCESS:
      return {
        ...state,
        searchedLoanApplications:
          action.payload.page === 1
            ? action.payload.data
            : [...state.searchedLoanApplications, ...action.payload.data],
        loading: false,
        message: action.payload.message,
        success: action.payload.success,
        searchPage: action.payload.page,
        searchTotalPages: action.payload.totalPages,
      };

    case types.CLEAR_LOAN_SEARCH:
      return {
        ...state,
        searchedLoanApplications: [],
        searchApplications: [],
        searchPage: 1,
        searchTotalPages: 1,
        loading: false,
      };

    case RESET_LOAN_APPLICATION.SUCCESS:
      return {
        ...state,
        selectedLoanApplication: null,
        selectedApplicationId: null,
        isReadOnlyLoanApplication: false,
      };

    case SET_LOAN_FILTER_VALUE.SUCCESS:
      return {...state, loanFilterValue: action.payload};

    case types.RESET_APP_STATE:
      return {...initialState};

    default:
      return state;
  }
};

export default loanApplicationReducer;
