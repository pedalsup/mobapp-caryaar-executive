import {
  Button,
  DocumentGroup,
  FilePickerModal,
  FullLoader,
  Header,
  SafeAreaWrapper,
  StepTracker,
  theme,
} from '@caryaar/components';
import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {goBack} from '../../../navigation/NavigationUtils';

const Partner_Document_Form_Component = ({
  showImages,
  errorSteps,
  handleNextPress,
  businessDocuments,
  otherDocuments,
  bankDocuments,
  handleFile,
  showFilePicker,
  closeFilePicker,
  isNewPartner,
  isLoadingDocument,
}) => {
  return (
    <SafeAreaWrapper>
      <Header
        title={`${isNewPartner ? 'Add New Partner' : 'Partner Details'}`}
        onBackPress={goBack}
      />
      <StepTracker
        showImages={showImages}
        selectedId={3}
        errorSteps={errorSteps}
      />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <DocumentGroup
          title={'Business Documents'}
          documents={businessDocuments}
          isDocument={true}
          isView={false}
        />
        <DocumentGroup
          title={'Other Documents'}
          documents={otherDocuments}
          isDocument={true}
          isView={false}
        />
        <DocumentGroup
          title={'Bank Documents'}
          documents={bankDocuments}
          isDocument={true}
          isView={false}
        />
        <Button label={'Next'} onPress={handleNextPress} />
      </ScrollView>
      <FilePickerModal
        isVisible={showFilePicker}
        onSelect={handleFile}
        onClose={closeFilePicker}
        autoCloseOnSelect={false}
      />
      {isLoadingDocument && <FullLoader visible={isLoadingDocument} />}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.background,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: theme.sizes.spacing.smd,
  },
  halfWidth: {
    width: '47%',
    marginBottom: theme.sizes.spacing.smd,
  },
});

export default Partner_Document_Form_Component;
