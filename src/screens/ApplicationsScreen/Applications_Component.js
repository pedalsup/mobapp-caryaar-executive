import {
  CardWrapper,
  CommonModal,
  ImageHeader,
  PartnerCard,
  RadioButton,
  SafeAreaWrapper,
  Spacing,
  theme,
  Loader,
  PaginationFooter,
} from '@caryaar/components';
import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {NoDataFound} from '../../components';
import {getApplicationStatusLabel} from '../../constants/enums';
import {formatDate, getGradientColors} from '../../utils/helper';

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
}) => {
  const [isFilterModalVisible, setIsFilterModalVisible] = React.useState(false);
  const [activeFilterOption, setActiveFilterOption] = React.useState('');

  const handleApplyFilter = () => {
    onPressPrimaryButton?.(activeFilterOption);
    setActiveFilterOption('');
    setIsFilterModalVisible(false);
  };

  const handleOpenFilter = () => {
    setIsFilterModalVisible(true);
  };

  const handleCloseFilter = () => {
    setActiveFilterOption('');
    setIsFilterModalVisible(false);
  };

  return (
    <SafeAreaWrapper hideBottom>
      <ImageHeader
        onRightIconPress={onRightIconPress}
        hideSubHeader={false}
        hideProfileIcon
        subTittle="Applications"
        searchPlaceHolder={'Search by application number...'}
        onFilterPress={handleOpenFilter}
        onChangeText={onSearchText}
        value={searchText}
        onCancelIconPress={clearSearch}
        onSubmitEditing={setSearch}
      />

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
            gradientColors={getGradientColors(item.status)}
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
        ListEmptyComponent={
          !loading && <NoDataFound text="No Application Found" />
        }
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
        isVisible={isFilterModalVisible}
        onModalHide={handleCloseFilter}
        primaryButtonLabel={'Apply'}
        isScrollableContent={true}
        isPrimaryButtonVisible={true}
        onPressPrimaryButton={handleApplyFilter}
        isTextCenter={false}
        title="Filter by">
        <View style={{paddingVertical: 10}}>
          <RadioButton
            label={'Saved Vehicles'}
            selected={activeFilterOption === 'Saved'}
            onPress={() => setActiveFilterOption('Saved')}
          />
          <Spacing />
          <RadioButton
            label={'Draft Vehicles'}
            selected={activeFilterOption === 'Draft'}
            onPress={() => setActiveFilterOption('Draft')}
          />
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
});

export default Applications_Component;
