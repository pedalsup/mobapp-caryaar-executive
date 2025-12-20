import React, {Component} from 'react';
import {connect} from 'react-redux';
import ScreenNames from '../../constants/ScreenNames';
import {getScreenParam, navigate} from '../../navigation/NavigationUtils';
import {fetchLoanApplicationFromIdThunk} from '../../redux/actions';
import {
  getDocumentLink,
  getDocumentRequirements,
  transformDocumentData,
  viewDocumentHelper,
} from '../../utils/documentUtils';
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
import {
  documentImageLabelMap,
  documentImageType,
  getLabelFromEnum,
  occupationLabelMap,
} from '../../constants/enums';

const loanDocuments = [
  documentImageType.ID_PROOF,
  documentImageType.ADDRESS_PROOF,
  documentImageType.PERMANENT_ADDRESS,
  documentImageType.INCOME_PROOF,
  documentImageType.BANKING_PROOF,
  documentImageType.BUSINESS_PROOF,
  documentImageType.INSURANCE,
  documentImageType.OTHER_DOCUMENTS,
];

class ApplicationDetailScreen extends Component {
  state = {
    applicationID: getScreenParam(this.props.route, 'params')?.id || '',
    applicationDetail: {},
    isLoading: false,
    documentType: '',
    aadharBackphotoLink: null,
    aadharFrontPhotoLink: null,
    pancardPhotoLink: null,
    loading: false,
    documents: {},
  };

  componentDidMount() {
    const loanId = this.props.route.params.loanId || '';
    const {selectedLoanApplication} = this.props;

    if (loanId && !selectedLoanApplication) {
      this.setState({loading: true});

      this.props.fetchLoanApplicationFromIdThunk(
        loanId,
        async response => {
          if (!response?.success) {
            this.setState({loading: false});
            return;
          }

          try {
            const detail = response?.data?.[0]?.customer?.customerDetails ?? {};
            const customerLoanDocuments =
              response?.data?.[0]?.customer?.CustomerLoanDocuments?.[0] ?? {};

            const [back, front, pancard] = await Promise.all([
              getDocumentLink(detail?.aadharBackphoto),
              getDocumentLink(detail?.aadharFrontPhoto),
              getDocumentLink(detail?.pancardPhoto),
            ]);

            const formattedDocuments = await transformDocumentData(
              customerLoanDocuments,
              loanDocuments,
            );

            this.setState(
              {
                aadharBackphotoLink: back,
                aadharFrontPhotoLink: front,
                pancardPhotoLink: pancard,
                documents: formattedDocuments,
              },
              () => {
                this.setState({loading: false});
              },
            );
          } catch (e) {
            this.setState({loading: false});
          }
        },
        () => {
          this.setState({loading: false});
        },
      );
    }

    // if (loanId && !selectedLoanApplication) {
    //   this.setState({loading: true});
    //   this.props.fetchLoanApplicationFromIdThunk(
    //     loanId,
    //     async response => {
    //       console.log('response---------', response);

    //       if (response?.success) {
    //         const detail = response?.data?.[0]?.customer?.customerDetails || {};
    //         const customerLoanDocuments =
    //           response?.data?.[0]?.customer?.CustomerLoanDocuments?.[0] || {};

    //         const [back, front, pancard] = await Promise.all([
    //           getDocumentLink(detail?.aadharBackphoto),
    //           getDocumentLink(detail?.aadharFrontPhoto),
    //           getDocumentLink(detail?.pancardPhoto),
    //         ]);

    //         this.setState({
    //           aadharBackphotoLink: back,
    //           aadharFrontPhotoLink: front,
    //           pancardPhotoLink: pancard,
    //         });

    //         await new Promise(resolve => setTimeout(resolve, 100));

    //         const formattedDocuments = await transformDocumentData(
    //           customerLoanDocuments,
    //           loanDocuments,
    //         );

    //         this.setState({documents: formattedDocuments});
    //         await new Promise(resolve => setTimeout(resolve, 100));
    //         this.setState({loading: false});
    //       } else {
    //         this.setState({loading: false});
    //       }
    //     },
    //     error => {
    //       this.setState({loading: false});
    //     },
    //   );
    // }
  }

  safeGet = (obj, path) => {
    return this.props.loading ? '-' : get(obj, path, '-');
  };

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
    const {
      pancardPhotoLink,
      aadharBackphotoLink,
      aadharFrontPhotoLink,
      documents,
    } = this.state;
    const {loading, selectedLoanApplication} = this.props;
    const {
      partner = {},
      usedVehicle = {},
      customer = {},
      vehicle = {},
    } = selectedLoanApplication || {};

    const submittedOn = this.safeGet(selectedLoanApplication, 'createdAt');
    const lastUpdatedOn = this.safeGet(selectedLoanApplication, 'updatedAt');
    const occupationType = this.safeGet(
      customer?.customerDetails,
      'occupation',
    );

    const typeOfIndividual =
      selectedLoanApplication?.customer?.customerDetails?.occupation;
    const loanProduct = selectedLoanApplication?.loanType;

    const docs = getDocumentRequirements(
      loanProduct,
      typeOfIndividual,
      loanDocuments,
    );

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
            value: getLabelFromEnum(occupationLabelMap, occupationType),
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
        loading={this.state.loading}
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
        kycDocuments={{
          pancardPhoto: pancardPhotoLink,
          aadharFrontPhoto: aadharFrontPhotoLink,
          aadharBackphoto: aadharBackphotoLink,
        }}
        onDocumentPress={this.onDocumentPress}
        documentType={this.state.documentType}
        contactCustomer={this.contactCustomer}
        contactPartner={this.contactPartner}
        documentList={docs?.map(type => ({
          type,
          label: documentImageLabelMap[type],
          docObject: documents[type],
        }))}
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
