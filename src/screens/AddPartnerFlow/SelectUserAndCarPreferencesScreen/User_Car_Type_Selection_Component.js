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
  userTypeEnum,
  userTypeLabels,
  vehicleTypeEnum,
  vehicleTypeLabels,
} from '../../../constants/enums';

const User_Car_Type_Selection_Component = ({
  onBackPress,
  selectedUserType,
  onUserTypeSelect,
  selectedCarType,
  onCarTypeSelect,
  handleNextPress,
}) => {
  return (
    <SafeAreaWrapper>
      <Header title="Add New Partner" onBackPress={onBackPress} />
      <View style={styles.wrapper}>
        <Text>How many users are going to use this app?</Text>
        <Spacing size="smd" />
        <View style={styles.row}>
          <OptionCard
            value={userTypeEnum.SINGLE}
            label={userTypeLabels.SINGLE_USER}
            icon={images.userCircle}
            onSelect={onUserTypeSelect}
            isSelected={selectedUserType === userTypeEnum.SINGLE}
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
          <OptionCard
            value={userTypeEnum.MULTI}
            label={userTypeLabels.MULTI_USER}
            icon={images.userGroup}
            onSelect={onUserTypeSelect}
            isSelected={selectedUserType === userTypeEnum.MULTI}
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
        </View>
        <Spacing size="lg" />
        <Text>What type of cars do you sell?</Text>
        <Spacing size="smd" />
        <View style={styles.row}>
          <OptionCard
            value={vehicleTypeEnum.NEW}
            label={vehicleTypeLabels.NEW_CAR}
            icon={images.newVehicle}
            onSelect={onCarTypeSelect}
            isSelected={selectedCarType === vehicleTypeEnum.NEW}
            isMedium
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
          <OptionCard
            value={vehicleTypeEnum.USED}
            label={vehicleTypeLabels.USED_CAR}
            icon={images.usedVehicle}
            onSelect={onCarTypeSelect}
            isSelected={selectedCarType === vehicleTypeEnum.USED}
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

export default User_Car_Type_Selection_Component;
