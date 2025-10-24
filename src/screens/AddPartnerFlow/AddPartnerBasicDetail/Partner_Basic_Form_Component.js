import {
  BasicDetailsForm,
  Header,
  SafeAreaWrapper,
  StepTracker,
  theme,
  Loader,
} from '@caryaar/components';
import React from 'react';
import {StyleSheet} from 'react-native';

import {goBack} from '../../../navigation/NavigationUtils';

const Partner_Basic_Form_Component = ({
  businessType,
  onBusinessTypePress,
  onChangeBusinessName,
  onChangeYearsInBusiness,
  onChangeMonthlyCarSales,
  onChangeOwnerName,
  onChangeMobileNumber,
  onChangeEmail,
  handleNextPress,
  dropdownOptions,
  onSelectBusinessType,
  restInputProps,
  showImages = [],
  errorSteps = [],
  isNewPartner,
  onStepPress,
  loading,
}) => {
  return (
    <SafeAreaWrapper>
      <Header
        title={`${isNewPartner ? 'Add New Partner' : 'Partner Details'}`}
        onBackPress={() => goBack()}
      />
      <StepTracker
        selectedId={1}
        showImages={showImages}
        errorSteps={errorSteps}
        onStepPress={onStepPress}
      />
      <BasicDetailsForm
        onSelectBusinessType={onSelectBusinessType}
        businessType={businessType}
        dropdownOptions={dropdownOptions}
        handleNextPress={handleNextPress}
        contentContainerStyle={styles.wrapper}
        onBusinessTypePress={onBusinessTypePress}
        onChangeBusinessName={onChangeBusinessName}
        onChangeYearsInBusiness={onChangeYearsInBusiness}
        onChangeMonthlyCarSales={onChangeMonthlyCarSales}
        onChangeOwnerName={onChangeOwnerName}
        onChangeMobileNumber={onChangeMobileNumber}
        onChangeEmail={onChangeEmail}
        restInputProps={restInputProps}
      />
      {loading && <Loader visible={loading} />}
    </SafeAreaWrapper>
  );
};
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.background,
    flexGrow: 1,
    padding: theme.sizes.padding,
    paddingBottom: theme.sizes.padding,
  },
});

export default Partner_Basic_Form_Component;
