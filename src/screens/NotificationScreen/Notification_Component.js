import {
  Header,
  NotificationCard,
  SafeAreaWrapper,
  theme,
  images,
  Loader,
} from '@caryaar/components';
import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {NoDataFound} from '../../components';
import {getRelativeTime} from '../../utils/helper';

const Notification_Component = ({
  dataList,
  onBackPress,
  onPressRightContent,
  loading,
  onRefresh,
  refreshing,
}) => {
  const statusIcons = {
    success: images.icApproved,
    pending: images.icPending,
    rejected: images.icRejected,
    undefined: images.icApproved,
  };

  return (
    <SafeAreaWrapper>
      <Header
        title="Notifications"
        showRightContent={true}
        rightLabel={'Mark as all Read'}
        rightLabelColor={theme.colors.primary}
        onBackPress={onBackPress}
        onPressRightContent={onPressRightContent}
      />
      <FlatList
        data={dataList}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({item}) => (
          <NotificationCard
            title={item?.title}
            // showBadge={!item?.isRead}
            subTitle={item?.body}
            imgSource={statusIcons[item.status]}
            timeline={getRelativeTime(item?.createdAt)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        // initialNumToRender={5}
        // maxToRenderPerBatch={5}
        // removeClippedSubviews
        ListEmptyComponent={<NoDataFound />}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
      {loading && <Loader visible={loading} />}
    </SafeAreaWrapper>
  );
};
const styles = StyleSheet.create({
  listContent: {
    backgroundColor: theme.colors.background,
    padding: theme.sizes.padding,
    flexGrow: 1,
    // paddingBottom: 40,
  },
});

export default Notification_Component;
