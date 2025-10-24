/* eslint-disable react-native/no-inline-styles */
import {get} from 'lodash';
import React, {Component} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {connect} from 'react-redux';

import {getScreenParam, navigate} from '../../../navigation/NavigationUtils';
import {setDocumentDetails, updatePartnerThunk} from '../../../redux/actions';
import {handleFileSelection} from '../../../utils/documentUtils';
import {showToast} from '../../../utils/helper';
import {
  partnerDocumentLabelMap,
  partnerDocumentType,
} from '../../../constants/enums';
import ScreenNames from '../../../constants/ScreenNames';

import Partner_Document_Form_Component from './Partner_Document_Form_Component';
import {viewDocumentHelper} from '../../../utils/documentUtils';

class AddPartnerRequiredDocument extends Component {
  constructor(props) {
    super(props);
    this.state = {
      documents: {}, // Holds selected/uploaded documents by type
      showImages: [],
      errorSteps: [],
      isLoadingDocument: false,
      showFilePicker: false,
      selectedDocType: null,
    };
  }

  componentDidMount() {
    const {route, documentDetails} = this.props;
    const navState = getScreenParam(route, 'params', null);
    const fromScreen = get(navState, 'fromScreen', false);

    const formattedDocs = {};
    if (fromScreen) {
      // Format documents from API into internal structure
      documentDetails?.forEach(doc => {
        formattedDocs[doc.documentType] = {
          uri: doc.documentUrl,
          isLocal: false,
          type: null,
          fileSize: null,
          uploadedUrl: doc.documentUrl,
        };
      });
    }

    this.setState({
      fromScreen,
      showImages: get(navState, 'showImages', []),
      errorSteps: get(navState, 'errorSteps', []),
      documents: formattedDocs,
    });
  }

  handleViewImage = async uri => {
    if (!uri) {
      return;
    }

    setTimeout(async () => {
      this.setState({isLoadingDocument: true});
      try {
        await viewDocumentHelper(
          uri,
          imageUri => {
            navigate(ScreenNames.ImagePreviewScreen, {uri: imageUri});
          },
          error => {
            console.warn('Error opening file:', error);
            showToast('error', 'Could not open the document.', 'bottom', 3000);
          },
        );
      } finally {
        this.setState({isLoadingDocument: false});
      }
    }, 50);
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

  handleNextPress = () => {
    const payload = Object.keys(this.state.documents).map(key => ({
      documentType: key,
      documentUrl: this.state.documents[key].uploadedUrl,
    }));

    this.props.setDocumentDetails(payload);
    navigate(ScreenNames.AddPartnersBankDetail, {
      params: {
        fromScreen: this.state.fromScreen,
        showImages: this.state.showImages,
        errorSteps: this.state.errorSteps,
      },
    });
  };

  closeFilePicker = () => {
    this.setState({showFilePicker: false});
  };

  handleFile = type => {
    // Handles file selected from FilePickerModal
    handleFileSelection(type, async asset => {
      if (!asset?.uri) {
        return;
      }

      const docObj = {
        uri: asset.uri,
        name: asset.fileName,
        type: asset.type,
        isLocal: true,
        fileSize: asset.fileSize,
        uploadedUrl:
          'https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf', // mock URL for now
      };

      this.setState(prev => ({
        documents: {
          ...prev.documents,
          [this.state.selectedDocType]: docObj,
        },
        selectedDocType: '',
        showFilePicker: false,
      }));

      // TODO: Upload logic placeholder, uncomment when implementing real upload
      // try {
      //   const formData = new FormData();
      //   formData.append('file', {
      //     uri: docObj.uri,
      //     type: docObj.type,
      //     name: docObj.name,
      //   });

      //   const response = await uploadDocumentMultipart(formData);
      //   const url = response?.data?.url;

      //   if (url) {
      //     this.setState(prev => ({
      //       documents: {
      //         ...prev.documents,
      //         [type]: {
      //           ...prev.documents[type],
      //           uploadedUrl: url,
      //         },
      //       },
      //     }));
      //   }
      // } catch (error) {
      //   showApiErrorToast(error);
      // }
    });
  };

  render() {
    const {documents, isLoadingDocument, showFilePicker} = this.state;
    const {selectedPartner} = this.props;

    return (
      <>
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
            viewImage: () => this.handleViewImage(documents[type]?.uri),
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
            viewImage: () => this.handleViewImage(documents[type]?.uri),
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
            viewImage: () => this.handleViewImage(documents[type]?.uri),
          }))}
          showFilePicker={showFilePicker}
          handleFile={this.handleFile}
          closeFilePicker={this.closeFilePicker}
          showDocumentLoading={isLoadingDocument}
          isNewPartner={
            !selectedPartner || Object.keys(selectedPartner).length === 0
          }
        />

        {isLoadingDocument && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: '100%',
              zIndex: 999,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ActivityIndicator size={'large'} />
          </View>
        )}
      </>
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
