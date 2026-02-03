import {types} from '../actions';
import {
  ADD_SALES_EXECUTIVE,
  FETCH_SALES_EXECUTIVES,
  REMOVE_SALES_EXECUTIVE,
  REMOVE_SALES_EXECUTIVE_BY_ID,
} from '../actions/actionType';

const initialState = {
  salesExecutives: [],
  loading: false,
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  success: false,
  message: '',
};

const salesExecutiveReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SALES_EXECUTIVES.REQUEST:
    case ADD_SALES_EXECUTIVE.REQUEST:
    case REMOVE_SALES_EXECUTIVE_BY_ID.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_SALES_EXECUTIVES.FAILURE:
    case ADD_SALES_EXECUTIVE.FAILURE:
    case REMOVE_SALES_EXECUTIVE_BY_ID.FAILURE:
      return {
        ...state,
        loading: false,
        message: action.payload.message,
        success: action.payload.success,
      };
    case FETCH_SALES_EXECUTIVES.SUCCESS:
      return {
        ...state,
        salesExecutives:
          action.payload.page === 1
            ? action.payload.data
            : [...state.salesExecutives, ...action.payload.data],
        loading: false,
        page: action.payload.page,
        limit: action.payload.limit,
        total: action.payload.total,
        totalPages: action.payload.totalPages,
      };
    case ADD_SALES_EXECUTIVE.SUCCESS:
      return {
        ...state,
        salesExecutives: [action.payload, ...state.salesExecutives],
        message: action.payload.message,
        success: action.payload.success,
        loading: false,
      };

    case REMOVE_SALES_EXECUTIVE:
      return {
        ...state,
        loading: false,
        salesExecutives: state.salesExecutives.filter(
          executive => executive.userId !== action.payload,
        ),
      };
    case types.RESET_APP_STATE:
    case types.RESET_SALES_EXECUTIVE:
      return initialState;
    default:
      return state;
  }
};

export default salesExecutiveReducer;
