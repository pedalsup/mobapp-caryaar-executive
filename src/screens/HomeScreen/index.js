import React, {Component} from 'react';
import Home_Component from './Home_Component';
import {navigate, navigateToTab} from '../../navigation/NavigationUtils';
import ScreenNames from '../../constants/ScreenNames';
import {connect} from 'react-redux';
import {
  resetRegistration,
  resetPartnerDetail,
  setPartnerActiveTab,
} from '../../redux/actions';
import {
  fetchPartnerPerformancesThunk,
  fetchPartnerStatsThunk,
} from '../../redux/actions';
import {PARTNER_TAB_OPTIONS} from '../../constants/enums';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };
    this.onRightIconPress = this.onRightIconPress.bind(this);
  }

  componentDidMount() {
    let {partnerPerformances} = this.props;
    if (Array.isArray(partnerPerformances) && partnerPerformances?.length > 0) {
      // Not making api call when partnerPerformances data is there
      return;
    }
    this.fetchPartnerPerformances(false);
  }

  onRightIconPress = () => {
    navigate(ScreenNames.Notification);
  };

  onAddPartner = () => {
    this.props.resetRegistration();
    this.props.resetPartnerDetail();

    navigate(ScreenNames.DealershipTypeSelection);
  };

  fetchPartnerPerformances = async refreshing => {
    if (refreshing) {
      this.setState({refreshing: true});
    }
    this.props
      .fetchPartnerPerformancesThunk()
      .finally(() => this.setState({refreshing: false}));
    this.props.fetchPartnerStatsThunk();
  };

  onRefresh = async () => {
    this.fetchPartnerPerformances(true);
  };

  onActivePartnerPress = () => {
    //PARTNER_TAB_OPTIONS
    this.props.setPartnerActiveTab(PARTNER_TAB_OPTIONS[0]);
    navigateToTab(ScreenNames.Partners);
  };

  onPendingApprovalPress = () => {
    navigateToTab(ScreenNames.Applications);
  };

  onLoanApprovedPress = () => {
    navigateToTab(ScreenNames.Applications);
  };

  render() {
    const {partnerPerformances, loading, partnerStats} = this.props;
    const {refreshing} = this.state;
    return (
      <Home_Component
        onRightIconPress={this.onRightIconPress}
        onAddPartner={this.onAddPartner}
        partnerPerformances={partnerPerformances}
        loading={loading && !refreshing}
        onRefresh={this.onRefresh}
        refreshing={refreshing}
        partnerStats={partnerStats}
        onActivePartnerPress={this.onActivePartnerPress}
        onPendingApprovalPress={this.onPendingApprovalPress}
        onLoanApprovedPress={this.onLoanApprovedPress}
      />
    );
  }
}

const mapDispatchToProps = {
  resetRegistration,
  resetPartnerDetail,
  fetchPartnerPerformancesThunk,
  fetchPartnerStatsThunk,
  setPartnerActiveTab,
};
const mapStateToProps = ({partnerPerformance}) => {
  return {
    partnerPerformances: partnerPerformance.partnerPerformances,
    loading: partnerPerformance.loading,
    partnerStats: partnerPerformance.partnerStats,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
