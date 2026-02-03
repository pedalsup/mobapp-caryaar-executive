import {get} from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  businessTypeOptions,
  businessTypeValue,
  getLabelFromEnum,
} from '../../../constants/enums';
import ScreenNames from '../../../constants/ScreenNames';
import {getScreenParam, navigate} from '../../../navigation/NavigationUtils';
import {setBasicDetails, updatePartnerThunk} from '../../../redux/actions';
import {handleStepNavigation, showToast} from '../../../utils/helper';
import Partner_Basic_Form_Component from './Partner_Basic_Form_Component';
import {handleFieldChange, validateField} from '../../../utils/inputHelper';

class AddPartnerBasicDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      businessName: '',
      businessType: '',
      businessTypeValue: '',
      yearsInBusiness: '',
      monthlyCarSales: '',
      ownerName: '',
      mobileNumber: '',
      emailAddress: '',
      isEdit: false,
      errors: {
        businessName: '',
        yearsInBusiness: '',
        monthlyCarSales: '',
        ownerName: '',
        emailAddress: '',
        mobileNumber: '',
        businessType: '',
      },
      isFormValid: false,
      fromScreen: false,
      showImages: [],
      errorSteps: [],
    };
  }

  componentDidMount() {
    const {basicDetail, route} = this.props;
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
      businessName: get(basicDetail, 'businessName', ''),
      businessType: get(basicDetail, 'businessType', ''),
      yearsInBusiness: get(basicDetail, 'yearInBusiness', '')?.toString(),
      monthlyCarSales: get(basicDetail, 'monthlyCarSale', '')?.toString(),
      ownerName: get(basicDetail, 'ownerName', ''),
      mobileNumber: get(basicDetail, 'ownerMobileNumber', ''),
      emailAddress: get(basicDetail, 'ownerEmail', ''),
      isEdit: get(navState, 'isEdit', false),
    });
  }

  onSelectBusinessType = item => {
    this.setState(
      {
        businessType: item.value,
        businessTypeValue: item.value,
      },
      () => {
        this.onChangeField('businessType', this.state.businessType);
      },
    );
  };

  handleNextPress = async () => {
    const {
      businessName,
      yearsInBusiness,
      monthlyCarSales,
      ownerName,
      mobileNumber,
      emailAddress,
      businessType,
      isEdit,
      fromScreen,
      showImages,
      errorSteps,
    } = this.state;
    const isFormValid = this.validateAllFields();
    const {selectedPartnerId, isExistingPartner} = this.props;

    if (!isFormValid) {
      showToast('warning', 'Required field cannot be empty.', 'bottom', 3000);
      return;
    }

    let payLoad = {
      businessName,
      businessType: businessType,
      yearInBusiness: Number(yearsInBusiness),
      monthlyCarSale: Number(monthlyCarSales),
      ownerName,
      ownerMobileNumber: mobileNumber,
      ownerEmail: emailAddress,
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
            navigate(ScreenNames.AddPartnerBusinessLocation, navigationParams);
          }
        },
        error => {},
      );
      return;
    }

    this.props.setBasicDetails(payLoad);
    navigate(ScreenNames.AddPartnerBusinessLocation, navigationParams);
  };

  validateAllFields = () => {
    const fieldsToValidate = [
      'businessName',
      'businessType',
      'yearsInBusiness',
      'monthlyCarSales',
      'ownerName',
      'mobileNumber',
      'emailAddress',
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

  onStepPress = stepId => {
    const {fromScreen, showImages, errorSteps} = this.state;
    handleStepNavigation(stepId, {fromScreen, showImages, errorSteps});
  };

  render() {
    const {
      businessName,
      businessType,
      yearsInBusiness,
      monthlyCarSales,
      ownerName,
      mobileNumber,
      emailAddress,
      errors,
      showImages,
      errorSteps,
    } = this.state;

    const {selectedPartner, isLoading} = this.props;

    return (
      <Partner_Basic_Form_Component
        onSelectBusinessType={this.onSelectBusinessType}
        dropdownOptions={businessTypeOptions}
        businessType={getLabelFromEnum(businessTypeValue, businessType)}
        handleNextPress={this.handleNextPress}
        onChangeBusinessName={value =>
          this.onChangeField('businessName', value)
        }
        onChangeYearsInBusiness={value =>
          this.onChangeField('yearsInBusiness', value)
        }
        onChangeMonthlyCarSales={value =>
          this.onChangeField('monthlyCarSales', value)
        }
        onChangeOwnerName={value => this.onChangeField('ownerName', value)}
        onChangeMobileNumber={value =>
          this.onChangeField('mobileNumber', value)
        }
        onChangeEmail={value => this.onChangeField('emailAddress', value)}
        restInputProps={{
          businessName: {
            value: businessName,
            isError: errors.businessName,
            statusMsg: errors.businessName,
            autoCapitalize: 'words',
          },
          businessType: {
            value: getLabelFromEnum(businessTypeValue, businessType),
            isError: errors.businessType,
            statusMsg: errors.businessType,
          },
          yearsInBusiness: {
            value: yearsInBusiness,
            isError: errors.yearsInBusiness,
            statusMsg: errors.yearsInBusiness,
          },
          monthlyCarSales: {
            value: monthlyCarSales,
            isError: errors.monthlyCarSales,
            statusMsg: errors.monthlyCarSales,
          },
          ownerName: {
            value: ownerName,
            isError: errors.ownerName,
            statusMsg: errors.ownerName,
            autoCapitalize: 'words',
          },
          mobileNumber: {
            value: mobileNumber,
            isError: errors.mobileNumber,
            statusMsg: errors.mobileNumber,
          },
          emailAddress: {
            value: emailAddress,
            isError: errors.emailAddress,
            statusMsg: errors.emailAddress,
          },
        }}
        showImages={showImages}
        errorSteps={errorSteps}
        isNewPartner={
          !selectedPartner || Object.keys(selectedPartner).length === 0
        }
        onStepPress={this.onStepPress}
        loading={isLoading}
      />
    );
  }
}

const mapDispatchToProps = {setBasicDetails, updatePartnerThunk};
const mapStateToProps = ({appState, partnerForm, partners}) => {
  return {
    isInternetConnected: appState.isInternetConnected,
    isLoading: partners.loading,
    basicDetail: partnerForm.basicDetails,
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
)(AddPartnerBasicDetail);
