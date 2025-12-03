import {
  Card,
  ImageHeader,
  PartnerCard,
  SafeAreaWrapper,
  Spacing,
  Text,
  images,
  theme,
  Loader,
  PaginationFooter,
} from '@caryaar/components';
import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, StyleSheet, View} from 'react-native';
import {NoDataFound} from '../../components';
import {partnerDocumentLabelMap} from '../../constants/enums';
import {
  formatDate,
  getLocationText,
  removeCountryCode,
} from '../../utils/helper';

const limit = 10;

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const Partner_Component = ({
  onRightIconPress,
  onFilterPress,
  onAddButtonPress,
  onTabPress = () => {},
  partnersData,
  onItemPress,
  callToAction = () => {},
  onRefresh,
  refreshing,
  onSearchText,
  searchText,
  clearSearch,
  setSearch,
  onLoadMore,
  currentPage,
  loading,
  TAB_OPTIONS,
  totalPages,
  apiTrigger,
}) => {
  const [activeTab, setActiveTab] = useState('active');
  const [filteredPartners, setFilteredPartners] = useState([]);

  const selectedStatus = activeTab === 'active' ? 'APPROVED' : 'PENDING';
  const isPendingTab = activeTab !== 'active';

  useEffect(() => {
    filterPartners();
  }, [activeTab, partnersData]);

  const handleTabSelection = value => {
    setActiveTab(value);
    onTabPress(value);
  };

  const filterPartners = () => {
    const dataArray = Array.isArray(partnersData) ? partnersData : [];
    // TODO : Remove comment for the local filter
    // const filtered = dataArray.filter(
    //   p => p?.onboardingStatus === selectedStatus,
    // );
    setFilteredPartners(dataArray);
  };

  const getDocumentErrors = missingDocs =>
    missingDocs?.map(doc => ({
      value: partnerDocumentLabelMap[doc],
    })) || [];

  const renderPartner = ({item}) => {
    const isMissingDocs = item?.missingDocuments?.length > 0;

    const statusObject = {
      text: isMissingDocs ? 'Missing Documents' : 'All Documents Submitted',
      icon: isMissingDocs ? images.infoStatus : images.successCheck,
      color: isMissingDocs ? theme.colors.error : '#4CAF50',
    };

    return (
      <>
        <PartnerCard
          name={item?.companyName}
          location={
            !isPendingTab ? getLocationText(item?.city, item?.state) : undefined
          }
          phone={
            !isPendingTab
              ? removeCountryCode(item?.owner?.mobileNumber) || '-'
              : undefined
          }
          showPersonalInfo={!isPendingTab ? undefined : false}
          subtitle={
            isPendingTab
              ? `Submitted on: ${formatDate(item?.createdAt)}`
              : undefined
          }
          statusObject={isPendingTab ? statusObject : undefined}
          documentError={
            isPendingTab ? getDocumentErrors(item?.missingDocuments) : undefined
          }
          isCTAShow={isPendingTab ? isMissingDocs : undefined}
          buttonLabel={isPendingTab ? 'Upload Docs' : undefined}
          callToAction={isPendingTab ? () => callToAction?.(item) : undefined}
          onPress={() => onItemPress?.(item)}
          textColor={theme.colors.textPrimary}
        />
        <Spacing size="md" />
      </>
    );
  };

  const renderTabButton = tab => {
    const isActive = activeTab === tab;
    return (
      <Pressable
        key={tab}
        style={[styles.tabButton, isActive && styles.activeTabButton]}
        onPress={() => handleTabSelection(tab)}>
        <Text
          hankenGroteskBold={isActive}
          color={isActive ? theme.colors.primary : theme.colors.textLabel}>
          {capitalize(tab)}
        </Text>
      </Pressable>
    );
  };

  return (
    <SafeAreaWrapper hideBottom>
      <ImageHeader
        subTittle="Partners"
        searchPlaceHolder="Search by partners name"
        hideProfileIcon
        onRightIconPress={onRightIconPress}
        onFilterPress={onFilterPress}
        showAddBtn
        onAddButtonPress={onAddButtonPress}
        onChangeText={onSearchText}
        value={searchText}
        onCancelIconPress={clearSearch}
        onSubmitEditing={setSearch}
      />
      <View style={styles.container}>
        <Card padding={6} cardContainerStyle={styles.tabContainer}>
          {TAB_OPTIONS.map(renderTabButton)}
        </Card>
      </View>
      <Spacing />
      <FlatList
        data={filteredPartners}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderPartner}
        initialNumToRender={5}
        contentContainerStyle={styles.listContent}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReachedThreshold={0.5}
        onEndReached={onLoadMore}
        ListEmptyComponent={
          !loading && <NoDataFound text="No Partners found" />
        }
        ListFooterComponent={
          <PaginationFooter
            loadingMore={apiTrigger === 'loadMore'}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            footerMessage={'You’ve reached the end!'}
            minTotalPagesToShowMessage={1}
          />
        }
      />
      {loading && apiTrigger === 'default' && <Loader visible />}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.sizes.padding,
    paddingBottom: 0,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabButton: {
    height: 36,
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: {
    backgroundColor: '#1D95F012',
  },
  listContent: {
    flexGrow: 1,
    padding: theme.sizes.padding,
  },
});

export default Partner_Component;
