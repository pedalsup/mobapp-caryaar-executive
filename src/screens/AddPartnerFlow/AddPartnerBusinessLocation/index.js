import React, {Component} from 'react';
import {connect} from 'react-redux';
import ScreenNames from '../../../constants/ScreenNames';
import {
  getScreenParam,
  goBack,
  navigate,
} from '../../../navigation/NavigationUtils';
import {setLocationDetails, updatePartnerThunk} from '../../../redux/actions';
import {showToast} from '../../../utils/helper';
import Partner_Location_Form_Component from './Partner_Location_Form_Component';
import {get} from 'lodash';
import {handleFieldChange, validateField} from '../../../utils/inputHelper';

class AddPartnerBusinessLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyName: '',
      shopNo: '',
      buildingName: '',
      street: '',
      area: '',
      stateName: '',
      pincode: '',
      cityName: '',
      errors: {
        companyName: '',
        shopNo: '',
        buildingName: '',
        street: '',
        area: '',
        pincode: '',
        stateName: '',
      },
      isFormValid: false,
      fromScreen: false,
      errorSteps: [],
      showImages: [1, 2],
    };
  }

  componentDidMount() {
    const {locationDetails, route} = this.props;
    let navState = getScreenParam(route, 'params', null);
    let fromScreen = get(navState, 'fromScreen', false);
    if (fromScreen) {
      this.setState({
        showImages: get(navState, 'showImages', []),
        errorSteps: get(navState, 'errorSteps', []),
      });
    }
    this.setState({
      fromScreen: fromScreen,
      companyName: get(locationDetails, 'companyName', ''),
      shopNo: get(locationDetails, 'shopNo', ''),
      buildingName: get(locationDetails, 'buildingName', ''),
      street: get(locationDetails, 'streetAddress', ''),
      area: get(locationDetails, 'area', ''),
      stateName: get(locationDetails, 'state', ''),
      pincode: get(locationDetails, 'pincode', ''),
      cityName: get(locationDetails, 'city', ''),
    });
  }

  onBackPress = () => {
    goBack();
  };

  validateAllFields = () => {
    const fieldsToValidate = [
      'companyName',
      'shopNo',
      'buildingName',
      'street',
      'area',
      'stateName',
      'pincode',
      'cityName',
    ];

    const errors = {};
    let isFormValid = true;

    fieldsToValidate.forEach(key => {
      const value = this.state[key];
      const error = validateField(key, value);
      errors[key] = error;
      if (error !== '') {
        isFormValid = false;
      }
    });

    this.setState({errors, isFormValid});
    return isFormValid;
  };

  onChangeField = (key, value) => {
    handleFieldChange(this, key, value);
  };

  handleNextPress = async () => {
    const {
      companyName,
      shopNo,
      buildingName,
      street,
      area,
      stateName,
      pincode,
      fromScreen,
      showImages,
      errorSteps,
    } = this.state;

    const {selectedPartnerId, isExistingPartner} = this.props;

    const isFormValid = this.validateAllFields();

    if (!isFormValid) {
      showToast('error', 'Required field cannot be empty.', 'bottom', 3000);
      return;
    }

    let payLoad = {
      companyName,
      shopNo,
      buildingName,
      streetAddress: street,
      area,
      state: stateName,
      pincode: pincode,
      latitude: 19.076,
      longitude: 72.877,
      city: 'Mumbai',
    };

    // Common navigation params
    const navigationParams = {
      params: {fromScreen, showImages, errorSteps},
    };

    if (isExistingPartner) {
      await this.props.updatePartnerThunk(
        selectedPartnerId,
        payLoad,
        onSuccess => {
          if (onSuccess?.success) {
            navigate(ScreenNames.AddPartnerRequiredDocument, navigationParams);
          }
        },
        error => {},
      );
      return;
    }

    this.props.setLocationDetails(payLoad);
    navigate(ScreenNames.AddPartnerRequiredDocument, navigationParams);
  };

  onGoogleMapPress = () => {
    // handle map press
  };

  onSelectState = (item, index) => {
    this.setState(
      {
        stateName: item?.label,
      },
      () => {
        this.onChangeField('stateName', this.state.stateName);
      },
    );
  };

  render() {
    const {
      companyName,
      shopNo,
      buildingName,
      street,
      area,
      stateName,
      pincode,
      errors,
      isFormValid,
      showImages,
      errorSteps,
      cityName,
    } = this.state;

    const {selectedPartner, isLoading} = this.props;

    return (
      <Partner_Location_Form_Component
        onBackPress={this.onBackPress}
        handleNextPress={this.handleNextPress}
        onChangeCompanyName={value => this.onChangeField('companyName', value)}
        onChangeShopNo={value => this.onChangeField('shopNo', value)}
        onChangeBuildingName={value =>
          this.onChangeField('buildingName', value)
        }
        onChangeStreet={value => this.onChangeField('street', value)}
        onChangeArea={value => this.onChangeField('area', value)}
        onChangePincode={value => this.onChangeField('pincode', value)}
        onGoogleMapPress={this.onGoogleMapPress}
        restInputProps={{
          companyName: {
            value: companyName,
            isError: errors.companyName,
            statusMsg: errors.companyName,
          },
          shopOfficeNumber: {
            value: shopNo,
            isError: errors.shopNo,
            statusMsg: errors.shopNo,
          },
          buildingName: {
            value: buildingName,
            isError: errors.buildingName,
            statusMsg: errors.buildingName,
          },
          street: {
            value: street,
            isError: errors.street,
            statusMsg: errors.street,
          },
          area: {
            value: area,
            isError: errors.area,
            statusMsg: errors.area,
          },
          state: {
            value: stateName,
            isError: errors.stateName,
            statusMsg: errors.stateName,
          },
          pincode: {
            value: pincode,
            isError: errors.pincode,
            statusMsg: errors.pincode,
            rightLabel: cityName,
            rightLabelPress: () => {},
            keyboardType: 'numeric',
            returnKeyType: 'done',
            onSubmitEditing: this.handleNextPress,
          },
        }}
        nextButtonDisabled={!isFormValid} // Disable the button if form is not valid
        onSelectState={this.onSelectState}
        stateName={stateName}
        showImages={showImages}
        errorSteps={errorSteps}
        isNewPartner={
          !selectedPartner || Object.keys(selectedPartner).length === 0
        }
        loading={isLoading}
      />
    );
  }
}

const mapDispatchToProps = {
  setLocationDetails,
  updatePartnerThunk,
};
const mapStateToProps = ({appState, partnerForm, partners}) => {
  return {
    isInternetConnected: appState.isInternetConnected,
    isLoading: partners.loading,
    locationDetails: partnerForm.locationDetails,
    selectedPartner: partners.selectedPartner,
    selectedPartnerId: partners.selectedPartnerId,
    bankingDetails: partnerForm.bankingDetails,
    partnerForm: partnerForm,
    isExistingPartner: partners.isExistingPartner,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPartnerBusinessLocation);
