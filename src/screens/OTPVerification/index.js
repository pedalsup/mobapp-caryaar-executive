import React, {Component} from 'react';
import {connect} from 'react-redux';
import ScreenNames from '../../constants/ScreenNames';
import {goBack, navigateAndSimpleReset} from '../../navigation/NavigationUtils';
import {
  setLoginStatus as setReduxLoginStatus,
  setUserDetails,
  userLoginThunk,
} from '../../redux/actions';
import {setAccessToken, setLoginStatus} from '../../utils/storage';
import OTP_Verification_Component from './OTP_Verification_Component';
import {formatMobileNumber, showToast} from '../../utils/helper';
import {Loader} from '@caryaar/components';
const timerValue = 30;

class OTPVerification extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileNumber: '',
      timer: timerValue,
      isResendDisabled: true,
      otp: '',
      isError: false,
    };
    this.interval = null;
    this.resendOTP = this.resendOTP.bind(this);
    this.handleVerify = this.handleVerify.bind(this);
    this.onBackPress = this.onBackPress.bind(this);
    this.onOtpComplete = this.onOtpComplete.bind(this);
  }

  componentDidMount() {
    const {phone} = this.props;
    this.setState(
      {
        mobileNumber: phone,
      },
      () => this.startTimer(),
    );
  }

  startTimer = () => {
    this.setState({isResendDisabled: true, timer: timerValue});

    this.interval = setInterval(() => {
      this.setState(
        prevState => ({timer: prevState.timer - 1}),
        () => {
          if (this.state.timer === 0) {
            clearInterval(this.interval);
            this.setState({isResendDisabled: false});
          }
        },
      );
    }, 1000);
  };

  resendOTP = () => {
    if (this.state.isResendDisabled) {
      return;
    }

    this.setState({isError: false, otp: ''}, this.startTimer);
  };

  onBackPress = () => {
    goBack();
  };

  onOtpComplete = value => {
    this.setState({otp: value, isError: false}, () => {
      if (value.length === 4) {
        this.handleVerify();
      }
    });
  };

  handleVerify = async () => {
    const {otp} = this.state;
    const {phone} = this.props;
    const type = 'SALES_EXECUTIVE';

    if (otp.length !== 4) {
      showToast('error', 'Enter all 4 digits of the OTP to continue.');
      this.setState({isError: true});
      return;
    }

    const param = {
      mobileNumber: phone,
      otp: otp,
    };

    this.props.userLoginThunk(
      type,
      param,
      async response => {
        if (response.success && response?.data?.token) {
          const token = response.data.token;
          this.props.setUserDetails({
            name: 'John',
            email: 'john@example.com',
            address: 'New York',
            phone: phone,
          });
          await setLoginStatus(true);
          await setAccessToken(token);
          this.props.setReduxLoginStatus(true);
          return navigateAndSimpleReset(ScreenNames.HomeTab);
        } else {
          showToast('error', 'Invalid OTP. Please try again.');
        }
      },
      error => {},
    );
  };
  render() {
    const {mobileNumber, timer, isResendDisabled} = this.state;
    let {loading} = this.props;
    return (
      <>
        <OTP_Verification_Component
          mobileNumber={formatMobileNumber(mobileNumber)}
          timer={timer}
          isResendDisabled={isResendDisabled}
          resendOTP={this.resendOTP}
          validateOTP={this.handleVerify}
          onOtpComplete={this.onOtpComplete}
          onBackPress={this.onBackPress}
          isError={false}
          errorMessage="Please enter valid OTP"
        />
        {loading && <Loader visible={loading} />}
      </>
    );
  }
}

const mapDispatchToProps = {
  setReduxLoginStatus,
  setUserDetails,
  userLoginThunk,
};
const mapStateToProps = ({state, user}) => {
  return {
    phone: user.userDetails?.phone,
    loading: user?.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(OTPVerification);
