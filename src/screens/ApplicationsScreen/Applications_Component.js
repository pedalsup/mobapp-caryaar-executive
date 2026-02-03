import {
  CardWrapper,
  CommonModal,
  ImageHeader,
  Loader,
  PaginationFooter,
  PartnerCard,
  RadioButton,
  SafeAreaWrapper,
  Spacing,
  StatusChip,
  Text,
  theme,
} from '@caryaar/components';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {NoDataFound} from '../../components';
import {
  applicationStatusOptions,
  applicationStatusValue,
  getApplicationStatusLabel,
  getLabelFromEnum,
} from '../../constants/enums';
import {
  formatDate,
  getApplicationGradientColors,
  getApplicationStatusColor,
} from '../../utils/helper';

const Applications_Component = ({
  onRightIconPress,
  applications,
  onItemPress,
  onTrackApplicationPress,
  onPressPrimaryButton,
  loading,
  refreshing,
  onRefresh,
  onEndReached,
  loadingMore,
  onSearchText,
  searchText,
  clearSearch,
  setSearch,
  currentPage,
  totalPages,
  activeFilterOption,
  handleFilterApplications,
  filterApplicationProps,
  stopLoading,
}) => {
  const [localActiveFilterOption, setLocalActiveFilterOption] =
    React.useState(activeFilterOption);

  React.useEffect(() => {
    setLocalActiveFilterOption(activeFilterOption);
  }, [activeFilterOption]);

  const handleApplyFilter = () => {
    filterApplicationProps?.onPressPrimaryButton?.(localActiveFilterOption);
  };

  const handleClearFilter = () => {
    setLocalActiveFilterOption('');
    filterApplicationProps?.onClearFilterButton?.();
  };

  return (
    <SafeAreaWrapper hideBottom>
      <ImageHeader
        onRightIconPress={onRightIconPress}
        hideSubHeader={false}
        hideProfileIcon
        subTittle="Applications"
        searchPlaceHolder={'Search by application number...'}
        onFilterPress={handleFilterApplications}
        onChangeText={onSearchText}
        value={searchText}
        onCancelIconPress={clearSearch}
        onSubmitEditing={setSearch}
        hideHeader
        hideSubHeaderTop={false}
      />

      {activeFilterOption && (
        <View style={styles.filterWrapper}>
          <Text type="helper-text">FilterView</Text>
          <StatusChip
            label={getLabelFromEnum(applicationStatusValue, activeFilterOption)}
            onRemove={handleClearFilter}
          />
        </View>
      )}

      <FlatList
        contentContainerStyle={styles.wrapper}
        keyExtractor={(_, index) => index.toString()}
        data={applications}
        renderItem={({item}) => (
          <CardWrapper
            showLeftText
            isLeftTextBold
            isStatusBold
            leftText={item?.loanApplicationId}
            status={getApplicationStatusLabel(item.status)?.toUpperCase()}
            gradientColors={getApplicationGradientColors(item?.status)}
            statusTextColor={getApplicationStatusColor(item?.status)}
            onPress={() => onItemPress?.(item)}
            disableMargin={false}>
            <PartnerCard
              name={item?.partner?.businessName}
              subtitle={`Submitted on: ${formatDate(item.createdAt)}`}
              showPersonalInfo={false}
              isCTAShow
              callToAction={() => onTrackApplicationPress?.(item)}
              buttonLabel="Track Application"
              processingTime={item?.ProcessingTime}
            />
          </CardWrapper>
        )}
        showsVerticalScrollIndicator={false}
        windowSize={10}
        ListEmptyComponent={(!loading || stopLoading) && <NoDataFound />}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <PaginationFooter
            loadingMore={loadingMore}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            footerMessage={'You’ve reached the end!'}
          />
        }
      />

      <CommonModal
        isVisible={filterApplicationProps?.isVisible}
        onModalHide={() => {
          filterApplicationProps?.handleCloseFilter?.();
        }}
        primaryButtonLabel={'Apply'}
        isScrollableContent={true}
        isPrimaryButtonVisible={true}
        showSecondaryButton
        secondaryButtonText={'Clear'}
        onPressPrimaryButton={handleApplyFilter}
        onSecondaryPress={handleClearFilter}
        isTextCenter={false}
        title="Filter by">
        <View style={{paddingVertical: 10, marginBottom: -20}}>
          {applicationStatusOptions.map((option, index) => (
            <React.Fragment key={`${option.label}-${index}`}>
              <RadioButton
                label={option.label}
                selected={localActiveFilterOption === option.value}
                onPress={() => setLocalActiveFilterOption(option.value)}
              />
              <Spacing />
            </React.Fragment>
          ))}
        </View>
      </CommonModal>
      {loading && <Loader visible={loading} />}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.sizes.padding,
  },
  filterWrapper: {
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 5,
    backgroundColor: theme.colors.background,
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
});

export default Applications_Component;
