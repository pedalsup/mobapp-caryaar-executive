/* eslint-disable react-native/no-inline-styles */
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
import {partnerUserPosition} from '../../../constants/enums';
import rImages from '../../../assets/images';

const Select_Partner_Role_Component = ({
  onBackPress,
  selectedRole,
  onRoleSelect,
  handleNextPress,
}) => {
  return (
    <SafeAreaWrapper backgroundColor={theme.colors.background}>
      <Header title="Add New Partner" onBackPress={onBackPress} />
      <View style={styles.wrapper}>
        <Text>Who are you?</Text>
        <Spacing size="smd" />
        <View style={styles.row}>
          <OptionCard
            value={partnerUserPosition.DEALER_PRINCIPLE}
            label={'Dealer Principle'}
            icon={images.userCircle}
            onSelect={onRoleSelect}
            isSelected={selectedRole === partnerUserPosition.DEALER_PRINCIPLE}
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
          <OptionCard
            value={partnerUserPosition.SENIOR_MANAGEMENT}
            label={'Senior Management'}
            icon={rImages.ic_management}
            onSelect={onRoleSelect}
            isSelected={selectedRole === partnerUserPosition.SENIOR_MANAGEMENT}
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />
        </View>
        <Spacing size="md" />
        <View style={styles.row}>
          <OptionCard
            value={partnerUserPosition.EMPLOYEE}
            label={'Employee'}
            icon={rImages.ic_employee}
            onSelect={onRoleSelect}
            isSelected={selectedRole === partnerUserPosition.EMPLOYEE}
            isMedium
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
          />

          <OptionCard
            value={partnerUserPosition.EMPLOYEE}
            label={'Employee'}
            icon={images.ic_employee}
            onSelect={onRoleSelect}
            isSelected={selectedRole === partnerUserPosition.EMPLOYEE}
            isMedium
            textProps={{
              size: 'small',
              hankenGroteskMedium: true,
            }}
            containerStyle={{opacity: 0}}
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

export default Select_Partner_Role_Component;
