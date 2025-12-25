import {types} from '../actions';
import {
  FETCH_PARTNER_PERFORMANCES,
  FETCH_PARTNER_STATS,
} from '../actions/actionType';

const initialState = {
  loading: false,
  partnerPerformances: [],
  partnerStats: {},
};

const performanceReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PARTNER_PERFORMANCES.REQUEST:
      return {
        ...state,
        loading: true,
      };

    case FETCH_PARTNER_PERFORMANCES.SUCCESS:
      return {
        ...state,
        loading: false,
        partnerPerformances: action.payload.data,
      };

    case FETCH_PARTNER_STATS.SUCCESS:
      return {
        ...state,
        loading: false,
        partnerStats: action.payload.data,
      };

    case FETCH_PARTNER_PERFORMANCES.FAILURE:
    case FETCH_PARTNER_STATS.FAILURE:
      return {
        ...state,
        loading: false,
      };

    case types.RESET_APP_STATE:
      return {...initialState};

    default:
      return state;
  }
};

export default performanceReducer;
