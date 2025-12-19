import React, {Component} from 'react';
import {connect} from 'react-redux';
import ScreenNames from '../../constants/ScreenNames';
import {navigate} from '../../navigation/NavigationUtils';
import {
  clearLoanSearch,
  fetchLoanApplicationsThunk,
  resetLoanApplication,
  searchLoanApplicationThunk,
  setLoanFilterFromHomePage,
} from '../../redux/actions';
import Applications_Component from './Applications_Component';
import {API_TRIGGER} from '../../constants/enums';
import debounce from 'lodash.debounce';

class ApplicationsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Tracks how the API was triggered (e.g., refresh, search, load more)
      apiTrigger: API_TRIGGER.DEFAULT,
      refreshing: false,

      // Search-related state
      isSearch: false,
      searchText: '',

      // Optional full-screen view toggle (unused but reserved)
      fullScreen: false,
      stopLoading: false,
      showFilterApplications: false,
      activeFilterOption: '',
      previousSearch: '',
    };

    this.limit = 10; // Pagination limit
    // this.onItemPress = this.onItemPress.bind(this);
    // this.handleTrackApplication = this.handleTrackApplication.bind(this);
    this.debouncedSearch = debounce(this.searchFromAPI, 500);
  }

  componentDidMount() {
    this.fetchAllApplication();
  }

  fetchAllApplication = (page = 1, param = {}) => {
    this.props
      .fetchLoanApplicationsThunk(page, this.limit, param)
      .finally(() => {
        this.setState({
          refreshing: false,
          apiTrigger: API_TRIGGER.DEFAULT,
          stopLoading: false,
        });
      });
  };

  pullToRefresh = async () => {
    this.setState({
      refreshing: true,
      searchText: '',
      isSearch: false,
      apiTrigger: API_TRIGGER.PULL_TO_REFRESH,
      activeFilterOption: '',
    });
    this.props.clearLoanSearch(); // reset search results in Redux
    await this.fetchAllApplication();
  };

  handleLoadMore = () => {
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
      this.fetchAllApplication(nextPage, {params: {search: searchText.trim()}});
    } else {
      this.fetchAllApplication(nextPage, payload);
    }
  };

  onItemPress = item => {
    this.props.resetLoanApplication();
    navigate(ScreenNames.ApplicationDetail, {loanId: item.id});
  };

  onTrackApplicationPress = item => {
    navigate(ScreenNames.TrackApplication, {params: item});
  };

  onRightIconPress = () => {
    navigate(ScreenNames.Notification);
  };

  onPressPrimaryButton = value => {
    this.setState(
      {
        showFilterApplications: false,
        activeFilterOption: value,
        isSearch: false,
        searchText: '',
      },
      () => {
        this.clearSearch();
        this.props.setLoanFilterFromHomePage(value);
      },
    );
  };

  onSearchText = text => {
    const trimmed = text.trim();

    this.setState({searchText: text, apiTrigger: API_TRIGGER.DEFAULT}, () => {
      if (trimmed === '') {
        this.setState({isSearch: false, previousSearch: ''});
        this.props.clearLoanSearch();
        this.fetchAllApplication(); // fallback to default
        return;
      }

      if (trimmed !== this.state.previousSearch) {
        this.setState({stopLoading: true, previousSearch: trimmed});
        this.debouncedSearch(trimmed);
      }
    });
  };

  clearSearch = () => {
    this.setState({searchText: '', isSearch: false});
    this.props.clearLoanSearch();
  };

  searchFromAPI = text => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      this.setState({isSearch: false});
      return;
    }

    this.setState({
      isSearch: true,
      apiTrigger: API_TRIGGER.DEFAULT,
      activeFilterOption: '',
    });
    this.fetchAllApplication(1, {params: {search: trimmed}});
  };

  getPageInfo = () => {
    const {page, totalPage, searchPage, searchTotalPages} = this.props;
    const {isSearch} = this.state;

    return isSearch ? [searchPage, searchTotalPages] : [page, totalPage];
  };

  onClearFilterButton = () => {
    this.setState({
      showFilterApplications: false,
      activeFilterOption: '',
    });
    this.props.setLoanFilterFromHomePage('');
  };
  handleFilterApplications = () => {
    this.setState({showFilterApplications: true});
  };

  componentDidUpdate(prevProps, prevState) {
    const {activeFilterOption, isSearch, searchText} = this.state;
    const {loanFilterValue, isFirstTimeNavigation} = this.props;

    if (prevProps.loanFilterValue !== loanFilterValue && !isSearch) {
      this.setState({activeFilterOption: loanFilterValue});
      let payload = {};
      if (loanFilterValue) {
        payload = {
          params: {
            status: loanFilterValue,
          },
        };
      }
      this.fetchAllApplication(1, payload);
    }
  }

  render() {
    const {applications, searchApplications, loading} = this.props;
    const {
      refreshing,
      apiTrigger,
      searchText,
      isSearch,
      showFilterApplications,
      activeFilterOption,
      stopLoading,
    } = this.state;

    const applicationsToShow = isSearch ? searchApplications : applications;

    const [currentPage, totalPages] = this.getPageInfo();

    const initialLoading =
      loading &&
      apiTrigger === API_TRIGGER.DEFAULT &&
      !refreshing &&
      !stopLoading;

    return (
      <Applications_Component
        applications={applicationsToShow}
        onItemPress={this.onItemPress}
        onTrackApplicationPress={this.onTrackApplicationPress}
        onRightIconPress={this.onRightIconPress}
        onPressPrimaryButton={this.onPressPrimaryButton}
        loading={initialLoading}
        refreshing={refreshing}
        onRefresh={this.pullToRefresh}
        onEndReached={this.handleLoadMore}
        loadingMore={apiTrigger === API_TRIGGER.LOAD_MORE}
        onSearchText={this.onSearchText}
        searchText={searchText}
        clearSearch={this.clearSearch}
        setSearch={this.searchFromAPI}
        currentPage={currentPage}
        totalPages={totalPages}
        filterApplicationProps={{
          isVisible: showFilterApplications,
          handleCloseFilter: () =>
            this.setState({showFilterApplications: false}),
          onPressPrimaryButton: value => this.onPressPrimaryButton(value),
          onClearFilterButton: this.onClearFilterButton,
        }}
        activeFilterOption={activeFilterOption}
        handleFilterApplications={this.handleFilterApplications}
        stopLoading={stopLoading}
      />
    );
  }
}

const mapStateToProps = ({applications}) => ({
  loading: applications.loading,
  applications: applications.applications,
  searchApplications: applications?.searchApplications,
  page: applications?.page,
  totalPage: applications?.totalPage,
  searchPage: applications.searchPage,
  searchTotalPages: applications.searchTotalPages,
  loanFilterValue: applications?.loanFilterValue,
});

const mapDispatchToProps = {
  fetchLoanApplicationsThunk,
  clearLoanSearch,
  searchLoanApplicationThunk,
  resetLoanApplication,
  setLoanFilterFromHomePage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationsScreen);
