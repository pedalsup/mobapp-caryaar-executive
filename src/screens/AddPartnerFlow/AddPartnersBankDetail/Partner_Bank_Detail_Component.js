import {
  SafeAreaWrapper,
  StepTracker,
  Header,
  AccountDetailsForm,
  theme,
  Loader,
} from '@caryaar/components';
import React from 'react';
import {StyleSheet} from 'react-native';
import {goBack} from '../../../navigation/NavigationUtils';

const Partner_Bank_Detail_Component = ({
  transferModes,
  selectedTransferMode,
  onTransferModeSelect,
  handleSubmitPress,
  onAccountNumberChange,
  onAccountHolderNameChange,
  onBankNamePress,
  onIFSCCodeChange,
  restInputProps,
  dropdownOptions,
  bankName,
  onSelectBank,
  showImages,
  errorSteps,
  searchBankNameFromAPI = () => {},
  isNewPartner,
  loading,
}) => {
  return (
    <SafeAreaWrapper>
      <Header
        title={`${isNewPartner ? 'Add New Partner' : 'Partner Details'}`}
        onBackPress={() => goBack()}
      />
      <StepTracker
        selectedId={4}
        showImages={showImages}
        errorSteps={errorSteps}
      />
      <AccountDetailsForm
        transferModes={transferModes}
        selectedTransferMode={selectedTransferMode}
        onTransferModeSelect={onTransferModeSelect}
        buttonName={'Submit'}
        onButtonPress={handleSubmitPress}
        contentContainerStyle={styles.wrapper}
        onAccountNumberChange={onAccountNumberChange}
        onAccountHolderNameChange={onAccountHolderNameChange}
        onBankNamePress={onBankNamePress}
        onIFSCCodeChange={onIFSCCodeChange}
        restInputProps={restInputProps}
        dropdownOptions={dropdownOptions}
        bankName={bankName}
        onSelectSuggestion={onSelectBank}
        searchBankNameFromAPI={searchBankNameFromAPI}
      />
      {loading && <Loader visible={loading} />}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
    paddingBottom: theme.sizes.padding,
  },
});

export default Partner_Bank_Detail_Component;
