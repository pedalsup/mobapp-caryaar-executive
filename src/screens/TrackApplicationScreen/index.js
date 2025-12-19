import React, {Component} from 'react';
import Track_Application_Component from './Track_Application_Component';
import {getScreenParam} from '../../navigation/NavigationUtils';
import {fetchLoanTrackingDetailsByAppId} from '../../services/loanServices';
import {showApiErrorToast} from '../../utils/helper';

class TrackApplicationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      trackingSteps: [],
      loanApplicationId: '',
    };
  }

  async componentDidMount() {
    let navState = getScreenParam(this.props.route, 'params');
    let applicationId = navState?.id;

    this.setState({
      loading: true,
      loanApplicationId: navState?.loanApplicationId,
    });

    try {
      const response = await fetchLoanTrackingDetailsByAppId(applicationId);
      if (response?.success) {
        this.setState({
          trackingSteps: response?.data,
        });
      }
    } catch (error) {
      showApiErrorToast(error);
    } finally {
      this.setState({loading: false});
    }
  }

  render() {
    const {loanApplicationId, trackingSteps, loading} = this.state;
    return (
      <Track_Application_Component
        loading={loading}
        trackingSteps={trackingSteps}
        loanApplicationId={loanApplicationId}
      />
    );
  }
}

export default TrackApplicationScreen;
