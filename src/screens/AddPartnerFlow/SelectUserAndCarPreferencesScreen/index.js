import React, {Component} from 'react';
import {connect} from 'react-redux';
import {userTypeEnum, vehicleTypeEnum} from '../../../constants/enums';
import ScreenNames from '../../../constants/ScreenNames';
import {goBack, navigate} from '../../../navigation/NavigationUtils';
import {setSellerType, setUserType} from '../../../redux/actions';
import User_Car_Type_Selection_Component from './User_Car_Type_Selection_Component';

class UserAndCarTypeSelection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCarType: vehicleTypeEnum.USED,
      selectedUserType: userTypeEnum.MULTI,
      isMultiUser: true,
    };
    this.onUserTypeSelect = this.onUserTypeSelect.bind(this);
    this.onCarTypeSelect = this.onCarTypeSelect.bind(this);
    this.handleNextPress = this.handleNextPress.bind(this);
    this.onBackPress = this.onBackPress.bind(this);
  }

  onUserTypeSelect = value => {
    this.setState({
      selectedUserType: value,
      isMultiUser: value === userTypeEnum.MULTI,
    });
  };

  onCarTypeSelect = value => {
    this.setState({
      selectedCarType: value,
    });
  };

  handleNextPress = () => {
    const {selectedCarType, selectedUserType} = this.state;

    this.props.setSellerType(selectedCarType);
    this.props.setUserType(this.state.isMultiUser);

    const nextScreen =
      selectedUserType === userTypeEnum.SINGLE
        ? ScreenNames.AddPartnerBasicDetail
        : ScreenNames.SelectPartnerRole;

    navigate(nextScreen);
  };

  onBackPress = () => {
    goBack();
  };

  render() {
    const {selectedCarType, selectedUserType} = this.state;
    return (
      <User_Car_Type_Selection_Component
        selectedUserType={selectedUserType}
        selectedCarType={selectedCarType}
        onUserTypeSelect={this.onUserTypeSelect}
        onCarTypeSelect={this.onCarTypeSelect}
        handleNextPress={this.handleNextPress}
        onBackPress={this.onBackPress}
      />
    );
  }
}

const mapDispatchToProps = {
  setSellerType,
  setUserType,
};
const mapStateToProps = state => {
  return {
    dealershipType: state.partnerForm.dealershipType,
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UserAndCarTypeSelection);
