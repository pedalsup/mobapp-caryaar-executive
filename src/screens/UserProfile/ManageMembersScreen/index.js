import React, {Component} from 'react';

import {Alert} from 'react-native';
import {connect} from 'react-redux';
import {salesExecOptions} from '../../../constants/enums';
import {
  createSalesExecutiveThunk,
  deleteSalesExecutiveByIdThunk,
  fetchSalesExecutivesThunk,
} from '../../../redux/actions';
import {
  formatMobileNumber,
  getErrorMessage,
  showToast,
} from '../../../utils/helper';
import {handleFieldChange, validateField} from '../../../utils/inputHelper';
import Manage_Members_Component from './Manage_Members_Component';

class ManageMemberScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      fullName: '',
      mobileNumber: '',
      selectedSalesExec: '',
      selectedSalesExecValue: '',
      email: '',
      errors: {
        fullName: '',
        mobileNumber: '',
        selectedSalesExecValue: '',
        email: '',
      },
      isFormValid: false,
      refreshing: false,
      loadingMore: false,
      isDeleteModalVisible: false,
      selectedMember: null,
      loading: false,
    };
    this.handleDeleteMemberPress = this.handleDeleteMemberPress.bind(this);
    this.handleAddNewMemberPress = this.handleAddNewMemberPress.bind(this);
    this.onModalHide = this.onModalHide.bind(this);
    this.onPressPrimaryButton = this.onPressPrimaryButton.bind(this);
  }

  componentDidMount() {
    this.fetchSalesExecutives();
  }

  fetchSalesExecutives = (page = this.props.page, limit = this.props.limit) => {
    this.props
      .fetchSalesExecutivesThunk(page, limit)
      .finally(() => this.setState({refreshing: false, loadingMore: false}));
  };

  handleDeleteMemberPress = (item, index) => {
    this.setState({
      isDeleteModalVisible: true,
      selectedMember: item,
    });
  };

  handleAddNewMemberPress = () => {
    this.setState({
      isVisible: true,
    });
  };

  onModalHide = () => {
    this.setState({
      isVisible: false,
      fullName: '',
      mobileNumber: '',
      selectedSalesExec: '',
      selectedSalesExecValue: '',
      email: '',
      errors: {
        fullName: '',
        mobileNumber: '',
        selectedSalesExecValue: '',
        email: '',
      },
    });
  };

  onPressPrimaryButton = () => {
    const {mobileNumber, fullName, selectedSalesExecValue, email} = this.state;
    const isFormValid = this.validateAllFields();

    if (isFormValid && !this.props.loading) {
      let param = {
        name: fullName,
        mobileNumber: formatMobileNumber(mobileNumber),
        email: email,
        position: selectedSalesExecValue,
      };
      this.props.createSalesExecutiveThunk(
        param,
        response => {
          if (response.success) {
            this.onModalHide();
          }
        },
        async error => {
          this.onModalHide();
          await new Promise(resolve => setTimeout(resolve, 200));
          showToast('error', getErrorMessage(error));
        },
      );
    }
  };

  setSelectedSalesExec = item => {
    this.setState(
      {
        selectedSalesExec: item,
      },
      () => {
        this.onChangeField('selectedSalesExecValue', item?.value);
      },
    );
  };

  handleLoadMore = () => {
    const {page, totalPages, limit, loading} = this.props;
    setTimeout(() => {
      if (!loading && page < totalPages) {
        this.setState({
          loadingMore: true,
        });
        this.fetchSalesExecutives(page + 1, limit);
      }
    }, 100); // small delay to wait for loading flag
  };

  onChangeField = (key, value) => {
    handleFieldChange(this, key, value);
  };

  validateAllFields = () => {
    const fieldsToValidate = [
      'fullName',
      'mobileNumber',
      'selectedSalesExecValue',
      'email',
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

  handleRefresh = async () => {
    this.setState({
      refreshing: true,
    });
    await this.fetchSalesExecutives(1); // fetch first page of normal applications
  };

  hideDeleteModal = () => {
    this.setState({
      isDeleteModalVisible: false,
      selectedMember: null,
    });
  };

  onDeleteMemberConfirm = () => {
    const {selectedMember} = this.state;
    if (!selectedMember?.userId) {
      return;
    }

    this.setState({loading: true});

    const finalize = () => {
      this.setState({loading: false});
      this.hideDeleteModal();
    };

    this.props.deleteSalesExecutiveByIdThunk(
      selectedMember?.userId,
      async onSuccess => {
        finalize();
        await new Promise(resolve => setTimeout(resolve, 220));
        showToast('success', onSuccess?.message);
      },
      error => {
        finalize();
      },
    );
  };

  render() {
    const {
      mobileNumber,
      fullName,
      selectedSalesExec,
      loadingMore,
      errors,
      email,
      refreshing,
      isDeleteModalVisible,
    } = this.state;
    const {salesExecutives, loading} = this.props;
    return (
      <Manage_Members_Component
        handleDeleteMemberPress={this.handleDeleteMemberPress}
        handleAddNewMemberPress={this.handleAddNewMemberPress}
        memberList={this.state.memberList}
        isVisible={this.state.isVisible}
        onModalHide={this.onModalHide}
        onPressPrimaryButton={this.onPressPrimaryButton}
        mobileNumber={mobileNumber}
        fullName={fullName}
        onChangeFullName={value => this.onChangeField('fullName', value)}
        onChangeMobileNumber={value =>
          this.onChangeField('mobileNumber', value)
        }
        onChangeEmail={value => this.onChangeField('email', value)}
        setSelectedSalesExec={this.setSelectedSalesExec}
        selectedSalesExec={selectedSalesExec?.label}
        salesExecOptions={salesExecOptions}
        salesExecutives={salesExecutives}
        handleLoadMore={this.handleLoadMore}
        isLoading={loading && !refreshing && !loadingMore}
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
          selectedSalesExec: {
            isError: errors.selectedSalesExecValue,
            statusMsg: errors.selectedSalesExecValue,
          },
          email: {
            value: email,
            isError: errors.email,
            statusMsg: errors.email,
          },
        }}
        refreshing={refreshing}
        onRefresh={this.handleRefresh}
        currentPage={this.props.page}
        totalPages={this.props.totalPages}
        loadingMore={this.state.loadingMore}
        deleteModalProp={{
          isDeleteModalVisible: isDeleteModalVisible,
          onModalHide: this.hideDeleteModal,
          onDeleteMemberConfirm: this.onDeleteMemberConfirm,
          loading: this.state.loading,
        }}
      />
    );
  }
}

const mapDispatchToProps = {
  fetchSalesExecutivesThunk,
  deleteSalesExecutiveByIdThunk,
  createSalesExecutiveThunk,
};
const mapStateToProps = ({appState, salesExecutives}) => {
  return {
    isInternetConnected: appState.isInternetConnected,
    salesExecutives: salesExecutives.salesExecutives,
    page: salesExecutives.page,
    limit: salesExecutives.limit,
    total: salesExecutives.total,
    totalPages: salesExecutives.totalPages,
    loading: salesExecutives.loading,
    success: salesExecutives.success,
    message: salesExecutives.message,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ManageMemberScreen);
