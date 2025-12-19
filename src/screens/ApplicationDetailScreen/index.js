import React, {Component} from 'react';
import {connect} from 'react-redux';
import ScreenNames from '../../constants/ScreenNames';
import {getScreenParam, navigate} from '../../navigation/NavigationUtils';
import {fetchLoanApplicationFromIdThunk} from '../../redux/actions';
import {viewDocumentHelper} from '../../utils/documentUtils';
import {
  formatDate,
  formatIndianNumber,
  formatMonths,
  formatValueWithUnit,
  getRelativeTime,
  getTimeDifference,
  showToast,
} from '../../utils/helper';
import Application_Detail_Component from './Application_Detail_Component';
import {get} from 'lodash';
import {Linking} from 'react-native';

class ApplicationDetailScreen extends Component {
  state = {
    applicationID: getScreenParam(this.props.route, 'params')?.id || '',
    applicationDetail: {},
    isLoading: false,
    documentType: '',
  };

  componentDidMount() {
    const loanId = this.props.route.params.loanId || '';
    const {selectedLoanApplication} = this.props;

    if (loanId && !selectedLoanApplication) {
      this.props.fetchLoanApplicationFromIdThunk(loanId);
    }
  }

  safeGet = (obj, path) => {
    return this.props.loading ? '-' : get(obj, path, '-');
  };

  //TODO check the logic with backend team
  getProcessingTime = () => {
    return;
    const submittedOn = this.safeGet(
      this.props.selectedLoanApplication,
      'createdAt',
    );
    const lastUpdatedOn = this.safeGet(
      this.props.selectedLoanApplication,
      'updatedAt',
    );

    if ([submittedOn, lastUpdatedOn].includes('-')) {
      return '-';
    }

    return getTimeDifference(submittedOn, lastUpdatedOn);
  };

  requestDocument = key => showToast('info', `Request ${key}`);

  onDocumentPress = async (type, link, hasDocument) => {
    if (!hasDocument) {
      return this.requestDocument(type);
    }

    this.setState({isLoading: true, documentType: type});

    await viewDocumentHelper(
      link,
      uri => navigate(ScreenNames.ImagePreviewScreen, {uri}),
      () =>
        showToast('warning', 'Could not open the document.', 'bottom', 3500),
      () => this.setState({isLoading: false, documentType: ''}),
    );
  };

  contactUser = (label, mobileNumber) => {
    if (!mobileNumber) {
      showToast('error', `${label} mobile number not available.`);
      return;
    }
    this.doPhoneCall(mobileNumber);
  };

  contactPartner = () => {
    const mobileNumber =
      this.props.selectedLoanApplication?.partnerUser?.user?.mobileNumber;
    this.contactUser('Partner', mobileNumber);
  };

  contactCustomer = () => {
    const mobileNumber =
      this.props.selectedLoanApplication?.customer?.mobileNumber;
    this.contactUser('Customer', mobileNumber);
  };

  doPhoneCall = mobileNumber => {
    const url = `tel:${mobileNumber}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          showToast('info', 'Your device does not support phone calls.');
          return;
        }
        return Linking.openURL(url);
      })
      .catch(err => {
        console.log('Error making phone call:', err);
        showToast('error', 'Failed to initiate call.');
      });
  };

  onTackApplicationPress = () => {
    navigate(ScreenNames.TrackApplication, {
      params: this.props.selectedLoanApplication,
    });
  };

  render() {
    const {loading, selectedLoanApplication} = this.props;
    const {
      partner = {},
      usedVehicle = {},
      customer = {},
      vehicle = {},
    } = selectedLoanApplication || {};

    const submittedOn = this.safeGet(selectedLoanApplication, 'createdAt');
    const lastUpdatedOn = this.safeGet(selectedLoanApplication, 'updatedAt');

    return (
      <Application_Detail_Component
        applicationDetail={this.state.applicationDetail}
        vehicleDetail={[
          {label: 'Make', value: this.safeGet(vehicle, 'make')},
          {label: 'Model', value: this.safeGet(vehicle, 'model')},
          {
            label: 'Registration',
            value: this.safeGet(usedVehicle, 'registerNumber'),
          },
          {
            label: 'Price',
            value: formatIndianNumber(this.safeGet(usedVehicle, 'salePrice')),
          },
          {
            label: 'Loan Amount',
            value: formatIndianNumber(
              this.safeGet(selectedLoanApplication, 'loanAmount'),
            ),
          },
        ]}
        customerDetail={[
          {
            label: 'Name',
            value: this.safeGet(customer?.customerDetails, 'applicantName'),
          },
          {label: 'Phone', value: this.safeGet(customer, 'mobileNumber')},
          {
            label: 'Location',
            value: this.safeGet(customer?.customerDetails, 'address'),
          },
          {
            label: 'Type',
            value: this.safeGet(customer?.customerDetails, 'occupation'),
          },
        ]}
        loanDetail={[
          {
            label: 'Amount',
            value: formatIndianNumber(
              this.safeGet(selectedLoanApplication, 'loanAmount'),
            ),
          },
          {
            label: 'Tenure',
            value: formatValueWithUnit({
              value: selectedLoanApplication?.tenure,
              loading,
              unit: 'Months',
            }),
          },
          {
            label: 'Interest Rate',
            value: formatValueWithUnit({
              value: selectedLoanApplication?.interesetRate,
              loading,
              unit: '%',
            }),
          },
          {
            label: 'EMI',
            value: formatIndianNumber(
              this.safeGet(selectedLoanApplication, 'emi'),
            ),
          },
        ]}
        onTackApplicationPress={this.onTackApplicationPress}
        isLoading={this.state.isLoading}
        loading={loading}
        loanApplicationId={this.safeGet(
          selectedLoanApplication,
          'loanApplicationId',
        )}
        loanStatus={this.safeGet(selectedLoanApplication, 'status')}
        businessName={this.safeGet(partner, 'businessName')}
        additionalNotes={usedVehicle?.additionalNotes}
        submittedOn={formatDate(submittedOn)}
        processingTime={this.getProcessingTime()}
        lastUpdatedOn={getRelativeTime(lastUpdatedOn)}
        loanDocuments={customer?.loanDocuments}
        kycDocuments={customer?.customerDetails}
        onDocumentPress={this.onDocumentPress}
        documentType={this.state.documentType}
        contactCustomer={this.contactCustomer}
        contactPartner={this.contactPartner}
      />
    );
  }
}

const mapStateToProps = ({applications}) => ({
  selectedLoanApplication: applications.selectedLoanApplication,
  selectedApplicationId: applications?.selectedApplicationId,
  loading: applications.loading,
});

const mapDispatchToProps = {
  fetchLoanApplicationFromIdThunk,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationDetailScreen);
