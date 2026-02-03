import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getLabelFromEnum, salesExecutiveValue} from '../../constants/enums';
import ScreenNames from '../../constants/ScreenNames';
import {navigate} from '../../navigation/NavigationUtils';
import {
  fetchUser,
  logoutUser,
  resetAppState,
  resetSalesExecutive,
  setLoginStatus,
} from '../../redux/actions';
import {removeCountryCode} from '../../utils/helper';
import Profile_Component from './Profile_Component';

class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogoutModal: false,
    };
    this.handleMenuPress = this.handleMenuPress.bind(this);
    this.onRightIconPress = this.onRightIconPress.bind(this);
    this.onEditProfilePress = this.onEditProfilePress.bind(this);
    this.onModalHide = this.onModalHide.bind(this);
    this.onPressPrimaryButton = this.onPressPrimaryButton.bind(this);
  }

  async componentDidMount() {
    this.fetchUser();
  }

  fetchUser = () => {
    this.props.fetchUser(
      user => {},
      error => {},
    );
  };

  handleMenuPress = (index, item) => {
    if (item.screenName === ScreenNames.Logout) {
      return this.handleLogout();
    }

    if (item.screenName === ScreenNames.ManageMember) {
      this.props.resetSalesExecutive();
    }
    navigate(item.screenName);
  };

  handleLogout = () => {
    this.toggleLogoutModal(true);
  };

  onRightIconPress = () => {
    navigate(ScreenNames.Notification);
  };

  onEditProfilePress = () => {
    navigate(ScreenNames.EditProfile);
  };

  toggleLogoutModal = visible => {
    this.setState({showLogoutModal: visible});
  };

  onPressPrimaryButton = async () => {
    this.toggleLogoutModal(false);
    this.props.logoutUser();
    // await clearLoginStatus();
    // this.props.resetAppState();
    // this.props.setLoginStatus(false);
    // navigateAndSimpleReset(ScreenNames.Login);
  };

  onModalHide = () => {
    this.toggleLogoutModal(false);
  };

  render() {
    const {showLogoutModal} = this.state;
    const {profileDetail, loading} = this.props;

    return (
      <Profile_Component
        handleMenuPress={this.handleMenuPress}
        onRightIconPress={this.onRightIconPress}
        onEditProfilePress={this.onEditProfilePress}
        showLogoutModal={showLogoutModal}
        onPressPrimaryButton={this.onPressPrimaryButton}
        onModalHide={this.onModalHide}
        // address={getLocationText()}
        name={profileDetail?.name}
        email={profileDetail?.email}
        phone={removeCountryCode(profileDetail?.mobileNumber)}
        designation={getLabelFromEnum(salesExecutiveValue, profileDetail?.role)}
        avatar={profileDetail?.profileImage}
        userID={profileDetail?.id}
        loading={loading}
      />
    );
  }
}

const mapDispatchToProps = {
  setLoginStatus,
  resetAppState,
  fetchUser,
  resetSalesExecutive,
  logoutUser,
};
const mapStateToProps = ({user}) => {
  return {
    userDetail: user?.userDetails,
    loading: user.loading,
    profileDetail: user.userProfile,
    error: user.error,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
