import {types} from '../actions';
import {CLEAR_PARTNER_FORM, RESET_REGISTRATION} from '../actions/actionType';

const initialState = {
  bankSuggestions: [],
  bankDetails: null,
  loading: false,
  error: null,
};

const bankReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.FETCH_BANKS_REQUEST:
    case types.FETCH_BANK_BY_SEARCH_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case types.FETCH_BANKS_SUCCESS:
      return {
        ...state,
        loading: false,
        bankSuggestions: action.payload,
      };

    case types.FETCH_BANK_BY_SEARCH_SUCCESS:
      return {
        ...state,
        loading: false,
        bankDetails: action.payload,
      };

    case types.FETCH_BANKS_FAILURE:
    case types.FETCH_BANK_BY_SEARCH_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case RESET_REGISTRATION:
    case CLEAR_PARTNER_FORM:
    case types.RESET_APP_STATE:
      return initialState;
    default:
      return state;
  }
};

export default bankReducer;
