import {types} from '../actions';
import {
  CLEAR_LOAN_SEARCH,
  FETCH_LOAN_APPLICATION_BY_ID,
  FETCH_LOAN_APPLICATIONS,
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
    case FETCH_LOAN_APPLICATIONS.REQUEST:
    case FETCH_LOAN_APPLICATION_BY_ID.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_LOAN_APPLICATIONS.SUCCESS:
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

    case FETCH_LOAN_APPLICATION_BY_ID.FAILURE:
    case FETCH_LOAN_APPLICATIONS.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case FETCH_LOAN_APPLICATION_BY_ID.SUCCESS:
      return {
        ...state,
        loading: false,
        selectedLoanApplication: action.payload,
        selectedApplicationId: action.payload?.id,
      };

    case CLEAR_LOAN_SEARCH:
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
