/* eslint-disable react-native/no-inline-styles */
import {
  Card,
  ImageHeader,
  images,
  InfoRow,
  Pressable,
  SafeAreaWrapper,
  Spacing,
  Text,
  theme,
  Loader,
} from '@caryaar/components';
import React from 'react';
import {FlatList, Image, View} from 'react-native';
import {InitialsAvatar, NoDataFound} from '../../components';
import ScreenNames from '../../constants/ScreenNames';
import {navigateToTab} from '../../navigation/NavigationUtils';
import {styles} from '../../styles/Home.style';

const Home_Component = ({
  onRightIconPress,
  onAddPartner,
  partnerPerformances,
  loading,
  onRefresh,
  refreshing,
  partnerStats,
}) => {
  const getTrendIcon = value =>
    value > 0 ? images.up_trend : value < 0 ? images.down_trend : null;

  const getTrendColor = value =>
    value > 0 ? '#5FC52E' : value < 0 ? '#B60003' : theme.colors.textLabel;

  const renderBox = (count, countColor, label, onPress) => {
    return (
      <Pressable style={styles.statBox} onPress={onPress}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            lineHeight={'h2'}
            size={'h2'}
            style={{flex: 1}}
            hankenGroteskExtraBold={true}
            color={countColor}>
            {count}
          </Text>
          <Image
            source={images.arrow_right}
            style={{marginLeft: 6, height: 20, width: 20}}
          />
        </View>

        <Text
          size={'small'}
          lineHeight={'small'}
          hankenGroteskMedium={true}
          color={theme.colors.textLabel}>
          {label}
        </Text>
      </Pressable>
    );
  };

  const renderItem = ({item}) => {
    return (
      <Card
        row
        cardContainerStyle={{
          alignItems: 'center',
          marginBottom: 12,
          gap: 13,
        }}>
        <InitialsAvatar name={item.companyName} fontSize="body" />
        {/* <Image
          source={images.placeholder_image}
          style={{height: 42, width: 42, borderRadius: 20}}
        /> */}
        <View style={{flex: 1}}>
          <Text hankenGroteskMedium={true}>{item?.companyName}</Text>
          <Spacing size={3} />
          <Text type={'helper-text'}>
            {`${item.this_month_count}`} application this month
          </Text>
        </View>
        <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
          <Image
            source={getTrendIcon(item.percentage_growth)}
            style={{height: 20, width: 20}}
          />
          <Text
            lineHeight={'small'}
            size={'small'}
            hankenGroteskMedium={true}
            color={getTrendColor(item.percentage_growth)}>
            {Math.abs(item.percentage_growth)}%
          </Text>
        </View>
      </Card>
    );
  };

  return (
    <SafeAreaWrapper hideBottom>
      <View style={styles.wrapper}>
        <ImageHeader
          onRightIconPress={onRightIconPress}
          hideSubHeader={true}
          hideProfileIcon
        />
        <View style={styles.header}>
          {/* User data */}
          <View style={styles.profileRow}>
            <Text
              hankenGroteskBold={true}
              color={'white'}
              style={{width: '80%'}}>
              CarYaar Sales
            </Text>
            <Text
              style={{width: '20%'}}
              hankenGroteskBold={true}
              textAlign={'right'}
              color={theme.colors.textLabel}
              size={theme.typography.fontSizes.small}>
              XX0012
            </Text>
          </View>
          <View style={styles.statsContainer}>
            {renderBox(
              partnerStats?.activePartners || '-',
              '#696EFF',
              'Active\nPartners',
              () => navigateToTab(ScreenNames.Partners),
            )}
            {renderBox(
              partnerStats?.pendingPartners || '-',
              '#F8A902',
              'Pending\nPartners',
              () => navigateToTab(ScreenNames.Partners),
            )}
            {renderBox(
              partnerStats?.totalPartners || '-',
              '#6EEE87',
              'Total\nPartners',
              () => navigateToTab(ScreenNames.Partners),
            )}
            {/* {renderBox(1211, '#696EFF', 'Active Partners', () =>
              navigateToTab(ScreenNames.Partners),
            )}
            {renderBox(3, '#F8A902', 'Pending Approvals', () =>
              navigateToTab(ScreenNames.Applications),
            )}
            {renderBox(2, '#6EEE87', 'Loan Approved', () =>
              navigateToTab(ScreenNames.Applications),
            )} */}
          </View>
        </View>
        <View style={styles.headerWrapper1}>
          <Text type={'h4'} hankenGroteskBold={true} lineHeight={24}>
            Partner Performance
          </Text>
          <Pressable onPress={onAddPartner}>
            <InfoRow
              iconSource={images.plus_icon}
              text="ADD NEW"
              textColor={theme.colors.primary}
              textStyle={{
                ...theme.typography.fontStyles.hankenGroteskBold,
              }}
            />
          </Pressable>
        </View>
        <FlatList
          contentContainerStyle={styles.flatListStyle}
          keyExtractor={(_, index) => index.toString()}
          data={partnerPerformances}
          renderItem={renderItem}
          ListEmptyComponent={<NoDataFound />}
          refreshing={refreshing}
          onRefresh={onRefresh}
          showsVerticalScrollIndicator={false}
        />
      </View>
      {loading && <Loader visible={loading} />}
    </SafeAreaWrapper>
  );
};
export default Home_Component;
