import {images} from '@caryaar/components';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {businessTypeValue, getLabelFromEnum} from '../../constants/enums';
import ScreenNames from '../../constants/ScreenNames';
import strings from '../../locales/strings';
import {
  getScreenParam,
  goBack,
  navigate,
} from '../../navigation/NavigationUtils';
import {
  fetchPartnerFromId,
  resetPartnerDetail,
  resetRegistration,
  setBankingDetails,
  setBasicDetails,
  setDealershipType,
  setDocumentDetails,
  setIsExistingPartner,
  setLocationDetails,
  setPartnerRole,
  setSellerType,
  setUserType,
} from '../../redux/actions';
import {getPresignedDownloadUrl} from '../../services';
import {
  buildDocumentsArray,
  viewDocumentHelper,
} from '../../utils/documentUtils';
import {
  getLocationText,
  getPartnerAddress,
  safeGet,
  showToast,
} from '../../utils/helper';
import Partner_Detail_Component from './Partner_Detail_Component';

class PartnerDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      partnerId: null,
      isFetchingDocument: {
        loading: false,
        documentType: '',
      },
    };
  }

  componentDidMount() {
    const route = this.props.route;
    const partnerId = getScreenParam(route, 'params')?.id;

    this.setState({partnerId}, () => {
      this.fetchPartnerFromId(partnerId);
    });
  }

  fetchPartnerFromId = partnerID => {
    this.setState({isLoading: true});
    this.props.fetchPartnerFromId(
      partnerID,
      success => {
        this.setState({isLoading: false});
      },
      error => this.setState({isLoading: false}),
    );
  };

  onBackPress = () => {
    goBack();
  };

  viewDocument = async (type, uri, isRequest) => {
    const {isFetchingDocument} = this.state;
    if (isFetchingDocument.loading) {
      return;
    }
    if (isRequest) {
      // TODO if required field needs to be requested
    }
    if (!uri) {
      return showToast('error', strings.errorNoDocumentUpload);
    }

    this.setState({
      isFetchingDocument: {
        loading: true,
        documentType: type,
      },
    });

    const downloadUrlResponse = await getPresignedDownloadUrl({
      objectKey: uri,
    });

    let downloadedUrl = downloadUrlResponse?.data?.url;

    try {
      await viewDocumentHelper(
        downloadedUrl,
        imageUri => {
          navigate(ScreenNames.ImagePreviewScreen, {uri: imageUri});
        },
        error => {
          showToast('error', 'Could not open the document.', 'bottom', 3000);
        },
      );
    } finally {
      this.setState({
        isFetchingDocument: {
          loading: false,
          documentType: '',
        },
      });
    }
  };

  onEditPartnerDetail = () => {
    this.props.setIsExistingPartner(true);
    navigate(ScreenNames.AddPartnerBasicDetail, {
      params: {
        fromScreen: true,
        showImages: [1, 2, 3, 4],
        errorSteps: [],
        isEdit: true,
      },
    });
  };

  render() {
    const {selectedPartner} = this.props;
    const {isLoading} = this.state;
    const {owner = {}, bankDetail = {}} = selectedPartner || {};

    return (
      <Partner_Detail_Component
        onBackPress={this.onBackPress}
        businessName={safeGet(isLoading, selectedPartner, 'businessName')}
        partnerDetail={selectedPartner}
        contactDetails={[
          {label: 'Owner', value: safeGet(isLoading, owner, 'name')},
          {
            label: 'Mobile Number',
            value: safeGet(isLoading, owner, 'mobileNumber'),
          },
          {
            label: 'EmailAddress',
            value: safeGet(isLoading, owner, 'email'),
            full: true,
          },
        ]}
        locationDetail={[
          {
            label: 'Company Name',
            value: safeGet(isLoading, selectedPartner, 'companyName'),
            full: true,
          },
          {
            label: 'Address',
            value: getPartnerAddress(selectedPartner),
            full: true,
          },
        ]}
        accountDetail={[
          {
            label: 'Account Number',
            value: safeGet(isLoading, bankDetail, 'accountNumber'),
          },
          {
            label: 'Account Holder Name',
            value: safeGet(isLoading, bankDetail, 'accountHolderName'),
          },
          {
            label: 'Bank Name',
            value: safeGet(isLoading, bankDetail, 'bankName'),
          },
          {
            label: 'IFSC Code',
            value: safeGet(isLoading, bankDetail, 'ifscCode'),
          },
          {
            label: 'Branch Name',
            value: safeGet(isLoading, bankDetail, 'branchName'),
          },
          {
            label: 'Settlement Preference',
            value: safeGet(isLoading, bankDetail, 'settlementPreference'),
          },
        ]}
        documents={buildDocumentsArray(selectedPartner, this.viewDocument)}
        isFetchingDocument={this.state.isFetchingDocument}
        businessType={getLabelFromEnum(
          businessTypeValue,
          selectedPartner?.businessType,
        )}
        infoRowDetails={[
          {
            value: safeGet(isLoading, owner, 'mobileNumber'),
            icon: images.phoneOutline,
            color: 'white',
          },
          {
            value: getLocationText(
              safeGet(isLoading, selectedPartner, 'city'),
              safeGet(isLoading, selectedPartner, 'state'),
            ),
            icon: images.locationPin,
            color: 'white',
          },
        ]}
        footerInfo={[
          {
            label: 'Years in Business',
            value: safeGet(isLoading, selectedPartner, 'yearInBusiness'),
          },
          {
            label: 'Monthly Car Sales',
            value: safeGet(isLoading, selectedPartner, 'monthlyCarSale'),
          },
        ]}
        onEditPartnerDetail={this.onEditPartnerDetail}
        isLoading={isLoading}
      />
    );
  }
}

const mapDispatchToProps = {
  fetchPartnerFromId,
  resetPartnerDetail,
  resetRegistration,
  setBasicDetails,
  setLocationDetails,
  setBankingDetails,
  setSellerType,
  setDealershipType,
  setUserType,
  setPartnerRole,
  setDocumentDetails,
  setIsExistingPartner,
};

const mapStateToProps = ({appState, partners}) => ({
  isInternetConnected: appState.isInternetConnected,
  isLoading: partners.loading,
  selectedPartner: partners?.selectedPartner,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PartnerDetailScreen);
