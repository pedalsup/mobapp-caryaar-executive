import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  API_TRIGGER,
  PARTNER_TAB_OPTIONS,
  partnerOnboardingStatus,
} from '../../constants/enums';
import ScreenNames from '../../constants/ScreenNames';
import {navigate} from '../../navigation/NavigationUtils';
import {
  clearSearchResults,
  fetchPartnerFromId,
  fetchPartnersThunk,
  resetPartnerDetail,
  resetRegistration,
  setIsExistingPartner,
  setPartnerActiveTab,
} from '../../redux/actions';
import Partner_Component from './Partner_Component';

class PartnersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      searchText: '',
      isSearch: false,
      apiTrigger: API_TRIGGER.DEFAULT,
    };
    this.limit = 10; // Pagination limit
    this.lastFetchedTab = null;
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      const {activeTab, activePartners, pendingPartners} = this.props;

      if (this.lastFetchedTab === activeTab) {
        return;
      }
      this.lastFetchedTab = activeTab;
      const hasData =
        activeTab === PARTNER_TAB_OPTIONS[0]
          ? activePartners?.length
          : pendingPartners?.length;

      if (hasData) {
        return;
      }

      this.fetchPartnersByTab(1);
    });
    // this.fetchPartnersByTab(1);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeTab !== this.props.activeTab) {
      this.lastFetchedTab = this.props.activeTab;
      this.fetchPartnersByTab(1);
    }
  }

  componentWillUnmount() {
    this.focusListener?.();
  }

  /* ----------------------------- Helpers ----------------------------- */

  isActiveTab = () => this.props.activeTab === PARTNER_TAB_OPTIONS[0];

  getOnboardingStatus = () =>
    this.isActiveTab()
      ? partnerOnboardingStatus.APPROVED
      : partnerOnboardingStatus.PENDING;

  getDisplayList = () => {
    const {activePartners, pendingPartners, searchPartners} = this.props;
    const {isSearch} = this.state;

    if (isSearch) {
      return searchPartners;
    }
    return this.isActiveTab() ? activePartners : pendingPartners;
  };

  getPageInfo = () => {
    const {page, totalPage, searchPage, searchTotalPages} = this.props;
    return this.state.isSearch
      ? [searchPage, searchTotalPages]
      : [page, totalPage];
  };

  /* ----------------------------- API Calls ----------------------------- */

  fetchPartnersByTab = async (page = 1) => {
    this.fetchPartners(page, {
      params: {onboardingStatus: await this.getOnboardingStatus()},
    });
  };

  fetchPartners = (page, payload) => {
    this.props.fetchPartnersThunk(page, this.limit, payload).finally(() =>
      this.setState({
        refreshing: false,
        apiTrigger: API_TRIGGER.DEFAULT,
      }),
    );
  };

  /* ----------------------------- Events ----------------------------- */

  onTabPress = activeTab => {
    if (this.props.activeTab === activeTab) {
      return; // 👈 prevent refetch if same tab clicked
    }
    this.lastFetchedTab = activeTab;

    this.props.setPartnerActiveTab(activeTab);
    this.setState({isSearch: false, searchText: ''}, () => {
      this.props.clearSearchResults();
      this.fetchPartnersByTab(1);
    });
  };

  handleLoadMore = async () => {
    const {loading} = this.props;
    const {isSearch, searchText, activeFilterOption} = this.state;

    if (loading) {
      return;
    }

    const [currentPage, totalPages] = this.getPageInfo();

    if (currentPage >= totalPages) {
      return;
    }
    const nextPage = currentPage + 1;
    this.setState({apiTrigger: API_TRIGGER.LOAD_MORE});

    let payload = {};

    if (activeFilterOption) {
      payload = {
        params: {
          status: activeFilterOption,
        },
      };
    }

    if (isSearch) {
      this.fetchPartners(nextPage, {
        params: {
          search: searchText.trim(),
          onboardingStatus: await this.getOnboardingStatus(),
        },
      });
    } else {
      this.fetchPartnersByTab(nextPage);
    }
  };

  pullToRefresh = async () => {
    this.setState({
      refreshing: true,
      searchText: '',
      isSearch: false,
      apiTrigger: API_TRIGGER.PULL_TO_REFRESH,
      activeFilterOption: '',
    });
    this.props.clearSearchResults();
    await this.fetchPartnersByTab();
  };

  onSearchText = text => {
    const trimmed = text.trim();
    this.setState({searchText: text});

    if (!trimmed) {
      this.setState({isSearch: false});
      this.props.clearSearchResults();
    }
  };

  searchFromAPI = text => {
    const trimmed = text.trim();
    if (trimmed.length <= 2) {
      return;
    }

    this.setState({isSearch: true}, async () => {
      this.fetchPartners(1, {
        params: {
          search: trimmed,
          onboardingStatus: await this.getOnboardingStatus(),
        },
      });
    });
  };

  clearSearch = () => {
    this.setState({searchText: '', isSearch: false});
    this.props.clearSearchResults();
  };

  /* ----------------------------- Events ----------------------------- */

  // Notification icon press
  onRightIconPress = () => navigate(ScreenNames.Notification);

  onAddButtonPress = () => {
    this.props.resetRegistration();
    this.props.resetPartnerDetail();
    this.props.setIsExistingPartner(false);
    navigate(ScreenNames.DealershipTypeSelection);
  };

  // Pending Partner Button click (Upload Documents)
  callToAction = partner => {
    this.props.resetPartnerDetail();
    this.fetchPartnerFromId(partner?.id);
  };

  fetchPartnerFromId = partnerID => {
    this.setState({apiTrigger: API_TRIGGER.DEFAULT});

    this.props.fetchPartnerFromId(
      partnerID,
      success => {
        this.props.setIsExistingPartner(true);
        navigate(ScreenNames.AddPartnerRequiredDocument, {
          params: {
            fromScreen: true,
            showImages: [1, 2, 3, 4],
            errorSteps: [3],
          },
        });
      },
      error => this.setState({isLoading: false}),
    );
  };

  // Partner card click handler
  onItemPress = item => {
    this.props.resetPartnerDetail();
    navigate(ScreenNames.PartnerDetail, {params: item});
  };

  render() {
    const {refreshing, apiTrigger, searchText, stopLoading} = this.state;
    const {loading} = this.props;
    const displayList = this.getDisplayList();
    const [currentPage, totalPages] = this.getPageInfo();
    const initialLoading =
      loading &&
      apiTrigger === API_TRIGGER.DEFAULT &&
      !refreshing &&
      !stopLoading;

    return (
      <Partner_Component
        onTabPress={this.onTabPress}
        TAB_OPTIONS={PARTNER_TAB_OPTIONS}
        onRightIconPress={this.onRightIconPress}
        partnersData={Array.isArray(displayList) ? displayList : []}
        onItemPress={this.onItemPress}
        callToAction={this.callToAction}
        onAddButtonPress={this.onAddButtonPress}
        onRefresh={this.pullToRefresh}
        refreshing={refreshing}
        onLoadMore={this.handleLoadMore}
        currentPage={currentPage}
        totalPages={totalPages}
        loading={initialLoading}
        onSearchText={this.onSearchText}
        searchText={searchText}
        clearSearch={this.clearSearch}
        setSearch={this.searchFromAPI}
        apiTrigger={apiTrigger}
        _activeTab={this.props.activeTab}
      />
    );
  }
}

// Redux mappings
const mapDispatchToProps = {
  resetRegistration,
  resetPartnerDetail,
  clearSearchResults,
  fetchPartnerFromId,
  setIsExistingPartner,
  setPartnerActiveTab,
  fetchPartnersThunk,
};

const mapStateToProps = ({partners}) => ({
  loading: partners.loading,
  activePartners: partners.activePartners,
  pendingPartners: partners.pendingPartners,
  searchPartners: partners.searchPartners,
  searchPage: partners.searchPage,
  searchTotalPages: partners.searchTotalPages,
  activeTab: partners.activeTab,
  page: partners?.page,
  totalPage: partners?.totalPage,
});

// Exporting connected component
export default connect(mapStateToProps, mapDispatchToProps)(PartnersScreen);
