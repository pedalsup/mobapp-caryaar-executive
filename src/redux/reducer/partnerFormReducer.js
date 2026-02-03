import {types} from '../actions';
import {CLEAR_PARTNER_FORM, RESET_REGISTRATION} from '../actions/actionType';

const initialState = {
  basicDetails: {},
  locationDetails: {},
  documentDetails: [],
  bankingDetails: {},
  partnerType: null,
  partnerRole: null,
  isMultiUser: true,
  sellerType: null,
};

const partnerFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_BASIC_DETAILS:
      return {...state, basicDetails: action.payload};
    case types.SET_LOCATION_DETAILS:
      return {...state, locationDetails: action.payload};
    case types.SET_DOCUMENT_DETAILS:
      return {...state, documentDetails: action.payload};
    case types.SET_BANKING_DETAILS:
      return {...state, bankingDetails: action.payload};
    case types.SET_DEALERSHIP_TYPE:
      return {
        ...state,
        partnerType: action.payload,
      };
    case types.SET_USER_TYPE:
      return {
        ...state,
        isMultiUser: action.payload,
        partnerRole: action.payload ? state.partnerRole : null,
      };
    case types.SET_SELLER_TYPE:
      return {
        ...state,
        sellerType: action.payload,
      };
    case types.SET_PARTNER_ROLE:
      return {
        ...state,
        partnerRole: action.payload,
      };
    case RESET_REGISTRATION:
    case CLEAR_PARTNER_FORM:
    case types.RESET_APP_STATE:
      return initialState;
    default:
      return state;
  }
};

export default partnerFormReducer;
