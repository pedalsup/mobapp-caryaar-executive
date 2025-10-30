import {get} from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';

import {getLabelFromEnum, salesExecutiveValue} from '../../../constants/enums';
import ScreenNames from '../../../constants/ScreenNames';
import {goBack, navigate} from '../../../navigation/NavigationUtils';
import {updateProfileThunk} from '../../../redux/actions';
import {
  handleFileSelection,
  viewDocumentHelper,
} from '../../../utils/documentUtils';
import {showToast} from '../../../utils/helper';
import Edit_Profile_Component from './Edit_Profile_Component';
import {validateField, handleFieldChange} from '../../../utils/inputHelper';

class EditProfileScreen extends Component {
  state = {
    fullName: '',
    email: '',
    mobileNumber: '',
    salesExecutivePosition: '',
    showFilePicker: false,
    profileImage: null,
    errors: {
      fullName: '',
      mobileNumber: '',
      email: '',
    },
    isFormValid: false,
  };

  componentDidMount() {
    const {profileDetail} = this.props;
    this.setState({
      fullName: get(profileDetail, 'name', ''),
      email: get(profileDetail, 'email', ''),
      mobileNumber: get(profileDetail, 'mobileNumber', ''),
      salesExecutivePosition: get(profileDetail, 'role', ''),
      profileImage: get(profileDetail, 'profileImage', ''),
    });
  }

  handleSavePress = () => {
    let param = {
      name: this.state.fullName,
      profileImage: 'https://randomuser.me/api/portraits/men/77.jpg',
      email: this.state.email,
      mobileNumber: this.state.mobileNumber,
    };
    const isFormValid = this.validateAllFields();
    if (!isFormValid) {
      return showToast('error', 'Please enter all field');
    }

    this.props.updateProfileThunk(
      param,
      success => {
        goBack();
      },
      error => {},
    );
  };

  onSalesPositionSelection = position => {
    this.setState({salesExecutivePosition: position?.value});
  };

  onEditProfilePicPress = () => this.setState({showFilePicker: true});

  closeFilePicker = () => this.setState({showFilePicker: false});

  handleFile = type => {
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
          'https://www.aeee.in/wp-content/uploads/2020/08/Sample-pdf.pdf', // mock
      };

      this.setState({
        profileImage: docObj.uri,
        showFilePicker: false,
      });

      // TODO : Upload API call here to get the link
    });
  };

  onDeleteProfileImage = () => this.setState({profileImage: ''});

  handleViewImage = async () => {
    let uri = this.state.profileImage;
    if (!uri) {
      return;
    }

    this.setState({isLoadingDocument: true});
    try {
      await viewDocumentHelper(
        uri,
        imageUri => {
          navigate(ScreenNames.ImagePreviewScreen, {uri: imageUri});
        },
        error => {
          showToast('error', 'Could not open the document.', 'bottom', 3000);
        },
      );
    } finally {
      this.setState({showFilePicker: false});
    }
  };

  validateAllFields = () => {
    const fieldsToValidate = ['fullName', 'mobileNumber', 'email'];

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

  render() {
    const {
      fullName,
      email,
      mobileNumber,
      salesExecutivePosition,
      profileImage,
      showFilePicker,
      errors,
    } = this.state;

    const {isLoading} = this.props;

    return (
      <Edit_Profile_Component
        handleSavePress={this.handleSavePress}
        state={{fullName, email, mobileNumber}}
        onEmailChange={value => this.onChangeField('email', value)}
        onFullNameChange={value => this.onChangeField('fullName', value)}
        onMobileChange={value => this.onChangeField('mobileNumber', value)}
        onSalesPositionSelection={this.onSalesPositionSelection}
        salesExecutivePosition={getLabelFromEnum(
          salesExecutiveValue,
          salesExecutivePosition,
        )}
        profileImage={profileImage}
        onEditProfilePicPress={this.onEditProfilePicPress}
        showFilePicker={showFilePicker}
        closeFilePicker={this.closeFilePicker}
        handleFile={this.handleFile}
        onDeleteProfileImage={this.onDeleteProfileImage}
        viewProfileImage={this.handleViewImage}
        restInputProps={{
          fullName: {
            value: fullName,
            isError: errors.fullName,
            statusMsg: errors.fullName,
            autoCapitalize: 'words',
          },
          mobileNumber: {
            value: mobileNumber,
            isError: errors.mobileNumber,
            statusMsg: errors.mobileNumber,
          },
          email: {
            value: email,
            isError: errors.email,
            statusMsg: errors.email,
          },
          salesExecutivePosition: {
            isError: errors.email,
            statusMsg: errors.email,
          },
        }}
        isLoading={isLoading}
      />
    );
  }
}

const mapDispatchToProps = {updateProfileThunk};

const mapStateToProps = ({appState, user}) => ({
  isInternetConnected: appState.isInternetConnected,
  isLoading: user.loading,
  profileDetail: user.userProfile,
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfileScreen);
