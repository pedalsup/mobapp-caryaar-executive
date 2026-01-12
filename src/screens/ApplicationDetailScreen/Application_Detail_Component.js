/* eslint-disable react-native/no-inline-styles */
import {
  Button,
  CardWrapper,
  DetailInfoCard,
  Header,
  Loader,
  PartnerCard,
  SafeAreaWrapper,
  Spacing,
  Text,
  TextAreaInput,
  theme,
  FullLoader,
} from '@caryaar/components';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

import {getApplicationStatusLabel} from '../../constants/enums';
import {goBack} from '../../navigation/NavigationUtils';
import {
  getApplicationGradientColors,
  getApplicationStatusColor,
} from '../../utils/helper';
import DocumentList from './DocumentList';

const Application_Detail_Component = ({
  onBackPress,
  vehicleDetail,
  customerDetail,
  loanDetail,
  onTackApplicationPress,
  viewPanCard,
  isLoading,
  loading,
  loanApplicationId,
  loanStatus,
  businessName,
  submittedOn,
  processingTime,
  lastUpdatedOn,
  kycDocuments,
  onDocumentPress,
  documentType,
  additionalNotes,
  contactCustomer,
  contactPartner,
  documentList,
}) => {
  return (
    <SafeAreaWrapper backgroundColor={theme.colors.background}>
      <Header title="Application Details" onBackPress={() => goBack()} />
      <ScrollView bounces={false} contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.wrapper}>
          <CardWrapper
            showLeftText
            isLeftTextBold
            isStatusBold
            leftText={loanApplicationId}
            status={getApplicationStatusLabel(loanStatus)?.toUpperCase()}
            statusTextColor={getApplicationStatusColor(loanStatus)}
            gradientColors={getApplicationGradientColors(loanStatus)}>
            <PartnerCard
              noMargin
              showRightArrow={false}
              name={businessName}
              subtitle={`Submitted on: ${submittedOn}`}
              buttonLabel="Track Application"
              processingTime={processingTime}
              textNote={`Last updated on ${lastUpdatedOn}`}
              callToAction={onTackApplicationPress}
              wrapperColor={theme.colors.gray900}
              partnerColor={theme.colors.white}
              suffixTextColor={theme.colors.white}
              showPersonalInfo={false}
              isCTAShow
            />
          </CardWrapper>
        </View>
        <View style={styles.secondWrapper}>
          <DetailInfoCard label="Vehicle Details" data={vehicleDetail} />
          <Spacing size="lg" />
          <DetailInfoCard label="Customer Details" data={customerDetail} />
          <Spacing size="lg" />
          <DetailInfoCard label={'Documents'} isSemiBold={false}>
            <DocumentList
              // isLoading={isLoading}
              documentType={documentType}
              kycDocuments={kycDocuments}
              onDocumentPress={onDocumentPress}
              loanDocumentList={documentList}
            />
          </DetailInfoCard>
          <Spacing size="lg" />
          <DetailInfoCard label="Loan Details" data={loanDetail} />
          <Spacing size="lg" />
          <Text>Add Note</Text>
          <Spacing size="smd" />
          <TextAreaInput
            label=""
            placeholder="No additional note"
            editable={false}
            value={additionalNotes}
            textAreaStyle={{backgroundColor: 'white', marginTop: 0}}
          />
          <Spacing size="xl" />
          <View style={styles.buttonWrapper}>
            <View style={styles.halfFlex}>
              <Button
                label={'Contact Partner'}
                variant="link"
                onPress={contactPartner}
              />
            </View>
            <View style={styles.halfFlex}>
              <Button
                label={'Contact Customer'}
                variant="link"
                onPress={contactCustomer}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {isLoading && <FullLoader visible={isLoading} />}
      {loading && <Loader visible={loading} />}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.primaryBlack,
    paddingVertical: theme.sizes.spacing.md,
    paddingHorizontal: theme.sizes.padding,
  },
  secondWrapper: {
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 25,
  },
  halfFlex: {
    flex: 0.5,
  },
});

export default Application_Detail_Component;
