import React, {Component} from 'react';
import Home_Component from './Home_Component';
import {navigate} from '../../navigation/NavigationUtils';
import ScreenNames from '../../constants/ScreenNames';
import {connect} from 'react-redux';
import {resetRegistration, resetPartnerDetail} from '../../redux/actions';
import {
  fetchPartnerPerformancesThunk,
  fetchPartnerStatsThunk,
} from '../../redux/actions';

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
      />
    );
  }
}

const mapDispatchToProps = {
  resetRegistration,
  resetPartnerDetail,
  fetchPartnerPerformancesThunk,
  fetchPartnerStatsThunk,
};
const mapStateToProps = ({partnerPerformance}) => {
  return {
    partnerPerformances: partnerPerformance.partnerPerformances,
    loading: partnerPerformance.loading,
    partnerStats: partnerPerformance.partnerStats,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
