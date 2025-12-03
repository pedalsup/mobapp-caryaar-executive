import {images, Loader} from '@caryaar/components';
import {get} from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {businessTypeValue, getLabelFromEnum} from '../../constants/enums';
import ScreenNames from '../../constants/ScreenNames';
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
import {
  buildDocumentsArray,
  viewDocumentHelper,
} from '../../utils/documentUtils';
import {
  getLocationText,
  getPartnerAddress,
  showApiErrorToast,
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

  viewDocument = async (type, link) => {
    this.setState({
      isFetchingDocument: {
        loading: true,
        documentType: type,
      },
    });

    await viewDocumentHelper(
      link,
      imageUri => {
        navigate(ScreenNames.ImagePreviewScreen, {uri: imageUri});
      },
      () => {
        showApiErrorToast({message: 'Could not open the document.'});
      },
      () => {
        this.setState({
          isFetchingDocument: {
            loading: false,
            documentType: '',
          },
        });
      },
    );
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

    const safeGet = (obj, path) => (isLoading ? '-' : get(obj, path, '-'));

    return (
      <>
        <Partner_Detail_Component
          onBackPress={this.onBackPress}
          businessName={safeGet(selectedPartner, 'businessName')}
          partnerDetail={selectedPartner}
          contactDetails={[
            {label: 'Owner', value: safeGet(owner, 'name')},
            {label: 'Mobile Number', value: safeGet(owner, 'mobileNumber')},
            {label: 'EmailAddress', value: safeGet(owner, 'email'), full: true},
          ]}
          locationDetail={[
            {
              label: 'Company Name',
              value: safeGet(selectedPartner, 'companyName'),
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
              value: safeGet(bankDetail, 'accountNumber'),
            },
            {
              label: 'Account Holder Name',
              value: safeGet(bankDetail, 'accountHolderName'),
            },
            {label: 'Bank Name', value: safeGet(bankDetail, 'bankName')},
            {label: 'IFSC Code', value: safeGet(bankDetail, 'ifscCode')},
            {label: 'Branch Name', value: safeGet(bankDetail, 'branchName')},
            {
              label: 'Settlement Preference',
              value: safeGet(bankDetail, 'settlementPreference'),
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
              value: safeGet(owner, 'mobileNumber'),
              icon: images.phoneOutline,
              color: 'white',
            },
            {
              value: getLocationText(
                safeGet(selectedPartner, 'city'),
                safeGet(selectedPartner, 'state'),
              ),
              icon: images.locationPin,
              color: 'white',
            },
          ]}
          footerInfo={[
            {
              label: 'Years in Business',
              value: safeGet(selectedPartner, 'yearInBusiness'),
            },
            {
              label: 'Monthly Car Sales',
              value: safeGet(selectedPartner, 'monthlyCarSale'),
            },
          ]}
          onEditPartnerDetail={this.onEditPartnerDetail}
        />

        {isLoading && <Loader visible={isLoading} />}
      </>
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
