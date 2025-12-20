import {
  Button,
  Header,
  images,
  OptionCard,
  SafeAreaWrapper,
  Spacing,
  Text,
  theme,
} from '@caryaar/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  dealershipTypeEnum,
  dealershipTypeLabels,
} from '../../../constants/enums';
import {goBack} from '../../../navigation/NavigationUtils';

const Dealership_Type_Selection_Component = ({
  onBackPress,
  selectedDealershipType,
  onDealerShipType,
  handleNextPress,
}) => {
  return (
    <SafeAreaWrapper>
      <Header title="Add New Partner" onBackPress={() => goBack()} />
      <View style={styles.wrapper}>
        <Text>Choose the dealership type</Text>
        <Spacing size="smd" />
        <View style={styles.row}>
          <OptionCard
            value={dealershipTypeEnum.OEM}
            label={dealershipTypeLabels.OEM}
            icon={images.userCircle}
            onSelect={onDealerShipType}
            isSelected={selectedDealershipType === dealershipTypeEnum.OEM}
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
          <OptionCard
            value={dealershipTypeEnum.MULTI_BRAND}
            label={dealershipTypeLabels.MULTI_BRAND}
            icon={images.userCircle}
            onSelect={onDealerShipType}
            isSelected={
              selectedDealershipType === dealershipTypeEnum.MULTI_BRAND
            }
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
        </View>
        <Spacing size="md" />
        <View style={styles.row}>
          <OptionCard
            value={dealershipTypeEnum.DSA}
            label={dealershipTypeLabels.DSA}
            icon={images.userCircle}
            onSelect={onDealerShipType}
            isSelected={selectedDealershipType === dealershipTypeEnum.DSA}
            isMedium
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
          <OptionCard
            value={dealershipTypeEnum.BROKER}
            label={dealershipTypeLabels.BROKER}
            icon={images.userCircle}
            onSelect={onDealerShipType}
            isSelected={selectedDealershipType === dealershipTypeEnum.BROKER}
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
        </View>
        <Spacing size="xl" />
        <Button label={'Next'} onPress={handleNextPress} />
      </View>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: theme.sizes.padding,
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default Dealership_Type_Selection_Component;
