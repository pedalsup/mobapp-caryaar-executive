import {get} from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
  partnerDocumentLabelMap,
  partnerDocumentType,
} from '../../../constants/enums';
import ScreenNames from '../../../constants/ScreenNames';
import {getScreenParam, navigate} from '../../../navigation/NavigationUtils';
import {setDocumentDetails, updatePartnerThunk} from '../../../redux/actions';
import {
  handleFileSelection,
  transformDocumentData,
  transformPartnerDocumentData,
  validateRequiredDocuments,
} from '../../../utils/documentUtils';
import {showToast} from '../../../utils/helper';

import strings from '../../../locales/strings';
import {getPresignedDownloadUrl} from '../../../services';
import {viewDocumentHelper} from '../../../utils/documentUtils';
import {uploadDocumentViaPresignedUrl} from '../../../utils/fileUploadUtils';
import Partner_Document_Form_Component from './Partner_Document_Form_Component';

const requiredFields = ['SHOP_LICENSE', 'AADHAR_CARD_FRONT'];

let partnerDocuments = [
  partnerDocumentType.GST_REGISTRATION,
  partnerDocumentType.SHOP_LICENSE,
  partnerDocumentType.PAN_CARD,
  partnerDocumentType.BANK_STATEMENT,
  partnerDocumentType.CANCELLED_CHEQUE,
  partnerDocumentType.BANK_STATEMENT,
  partnerDocumentType.CANCELLED_CHEQUE,
  partnerDocumentType.PHOTOGRAPH,
];

class AddPartnerRequiredDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: {}, // Holds selected/uploaded documents by type
      showImages: [1, 2],
      errorSteps: [],
      isLoadingDocument: false,
      showFilePicker: false,
      selectedDocType: null,
      isLoading: false,
    };
  }

  async componentDidMount() {
    const {route, documentDetails} = this.props;
    const navState = getScreenParam(route, 'params', null);
    const fromScreen = get(navState, 'fromScreen', false);

    const formattedDocs = {};

    if (fromScreen) {
      const formattedDocuments = await transformPartnerDocumentData(
        documentDetails,
        partnerDocuments,
      );

      let detail = await this.convertFormattedToDetails(formattedDocuments);

      detail?.forEach(doc => {
        formattedDocs[doc.documentType] = {
          uri: doc.documentUrl,
          isLocal: false,
          type: null,
          fileSize: null,
          uploadedUrl: doc.documentUrl,
          ...doc,
        };
      });

      this.setState({
        fromScreen,
        showImages: get(navState, 'showImages', []),
        errorSteps: get(navState, 'errorSteps', []),
      });
    }

    this.setState({
      fromScreen,
      documents: formattedDocs,
    });
  }

  handleViewImage = async uri => {
    if (!uri) {
      return showToast('error', strings.errorNoDocumentUpload);
    }

    this.setState({isLoadingDocument: true});

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
      this.setState({isLoadingDocument: false});
    }
  };

  handleDeleteMedia = type => {
    this.setState(prev => {
      const updated = {...prev.documents};
      delete updated[type];
      return {documents: updated};
    });
  };

  handleUploadMedia = async type => {
    // Trigger file picker modal
    this.setState({showFilePicker: true, selectedDocType: type});
  };

  handleNextPress = async () => {
    const {documents, fromScreen, showImages, errorSteps} = this.state;

    const {selectedPartnerId, isExistingPartner} = this.props;

    // if (!validateRequiredDocuments(documents, requiredFields)) {
    //   return;
    // }
    let payload = Object.keys(documents).map(key => ({
      documentType: key,
      documentUrl: documents[key].uploadedUrl,
    }));

    const navigationParams = {
      params: {fromScreen, showImages, errorSteps},
    };

    if (!isExistingPartner) {
      await this.props.updatePartnerThunk(
        selectedPartnerId,
        {
          documents: [
            {
              documentType: 'SHOP_LICENSE',
              documentUrl:
                'SHOP_LICENSE/ebc5b4dd-1acc-4b31-a4fa-4481def30396-1764828624268.pdf',
            },
            {
              documentType: 'GST_REGISTRATION',
              documentUrl:
                'GST_REGISTRATION/1f2fa126-60ce-49d5-b6dd-1b221ff79807-1764828630359.png',
            },
            {
              documentType: 'AADHAR_CARD_FRONT',
              documentUrl:
                'AADHAR_CARD_FRONT/bd903a00-81e4-4b35-bbd5-0fe9f3e4c9f4-1764828636857.png',
            },
          ],
        },
        onSuccess => {
          if (onSuccess?.success) {
            navigate(ScreenNames.AddPartnersBankDetail, navigationParams);
          }
        },
        error => {},
      );
      return;
    }

    this.props.setDocumentDetails(payload);
    navigate(ScreenNames.AddPartnersBankDetail, navigationParams);
  };

  closeFilePicker = () => {
    this.setState({showFilePicker: false});
  };

  handleFile = type => {
    handleFileSelection(type, async asset => {
      if (!asset?.uri) {
        return;
      }

      this.setState({showFilePicker: false, isLoadingDocument: true});

      try {
        const presignedKey = await uploadDocumentViaPresignedUrl(
          asset,
          this.state.selectedDocType,
        );

        const {data} = await getPresignedDownloadUrl({objectKey: presignedKey});

        const docObj = {
          uri: data?.url,
          uploadedUrl: presignedKey,
          uploadKey: presignedKey,
          selectedDocType: this.state.selectedAcceptedDocument,
        };

        this.setState(prev => ({
          documents: {
            ...prev.documents,
            [this.state.selectedDocType]: docObj,
          },
          selectedDocType: '',
          showFilePicker: false,
        }));
      } catch (error) {
        console.log('error----->', JSON.stringify(error));
        showToast('error', 'Something went wrong please try again..');
      } finally {
        this.setState({isLoadingDocument: false, showFilePicker: false});
      }
    });
  };

  convertFormattedToDetails = async (formattedDocuments = {}) => {
    const documentDetails = Object.values(formattedDocuments).map(doc => ({
      id: doc.id,
      partnerId: doc.partnerId,
      documentType: doc.documentType || doc.selectedDocType,
      documentUrl: doc.uri,
      verifiedByOps: doc.verifiedByOps ?? 'PENDING',
      uploadedAt: doc.uploadedAt || null,
      updatedAt: doc.updatedAt || null,
      uploadedUrl: doc.uploadedUrl,
    }));

    return documentDetails;
  };

  render() {
    const {documents, isLoadingDocument, showFilePicker} = this.state;
    const {selectedPartner, isExistingPartner} = this.props;

    return (
      <Partner_Document_Form_Component
        showImages={this.state.showImages}
        errorSteps={this.state.errorSteps}
        handleNextPress={this.handleNextPress}
        businessDocuments={[
          partnerDocumentType.GST_REGISTRATION,
          partnerDocumentType.SHOP_LICENSE,
          partnerDocumentType.PAN_CARD,
        ].map(type => ({
          type,
          label: partnerDocumentLabelMap[type],
          docObject: documents[type],
          onDeletePress: () => this.handleDeleteMedia(type),
          uploadMedia: () => this.handleUploadMedia(type),
          viewImage: () =>
            documents[type]?.uploadedUrl || isExistingPartner
              ? this.handleViewImage(documents[type]?.uploadedUrl)
              : this.handleUploadMedia(type),
          isRequired: requiredFields.includes(type),
        }))}
        otherDocuments={[
          partnerDocumentType.AADHAR_CARD_FRONT,
          partnerDocumentType.AADHAR_CARD_BACK,
          partnerDocumentType.PHOTOGRAPH,
        ].map(type => ({
          type,
          label: partnerDocumentLabelMap[type],
          docObject: documents[type],
          onDeletePress: () => this.handleDeleteMedia(type),
          uploadMedia: () => this.handleUploadMedia(type),
          viewImage: () =>
            documents[type]?.uploadedUrl || isExistingPartner
              ? this.handleViewImage(documents[type]?.uploadedUrl)
              : this.handleUploadMedia(type),
          isRequired: requiredFields.includes(type),
        }))}
        bankDocuments={[
          partnerDocumentType.BANK_STATEMENT,
          partnerDocumentType.CANCELLED_CHEQUE,
        ].map(type => ({
          type,
          label: partnerDocumentLabelMap[type],
          docObject: documents[type],
          onDeletePress: () => this.handleDeleteMedia(type),
          uploadMedia: () => this.handleUploadMedia(type),
          viewImage: () =>
            documents[type]?.uploadedUrl || isExistingPartner
              ? this.handleViewImage(documents[type]?.uploadedUrl)
              : this.handleUploadMedia(type),
          isRequired: requiredFields.includes(type),
        }))}
        showFilePicker={showFilePicker}
        handleFile={this.handleFile}
        closeFilePicker={this.closeFilePicker}
        isLoadingDocument={isLoadingDocument}
        isNewPartner={
          !selectedPartner || Object.keys(selectedPartner).length === 0
        }
      />
    );
  }
}

const mapDispatchToProps = {setDocumentDetails, updatePartnerThunk};
const mapStateToProps = ({appState, partnerForm, partners}) => ({
  isInternetConnected: appState.isInternetConnected,
  isLoading: appState.loading,
  documentDetails: partnerForm?.documentDetails,
  selectedPartner: partners.selectedPartner,
  selectedPartnerId: partners.selectedPartnerId,
  bankingDetails: partnerForm.bankingDetails,
  partnerForm: partnerForm,
  isExistingPartner: partners.isExistingPartner,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddPartnerRequiredDocument);
