import {types} from '../actions';
import {
  CLEAR_LOAN_SEARCH,
  FETCH_NOTIFICATIONS,
  MARK_ALL_NOTIFICATIONS_READ,
} from '../actions/actionType';

const initialState = {
  loading: false,
  notifications: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS.REQUEST:
    case MARK_ALL_NOTIFICATIONS_READ.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_NOTIFICATIONS.SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload,
      };

    case MARK_ALL_NOTIFICATIONS_READ.SUCCESS:
      return {
        ...state,
        loading: false,
      };

    case FETCH_NOTIFICATIONS.FAILURE:
    case MARK_ALL_NOTIFICATIONS_READ.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case CLEAR_LOAN_SEARCH:
    case types.RESET_APP_STATE:
      return {...initialState};

    default:
      return state;
  }
};

export default notificationReducer;
