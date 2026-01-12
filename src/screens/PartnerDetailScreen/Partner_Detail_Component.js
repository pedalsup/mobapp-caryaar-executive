/* eslint-disable react-native/no-inline-styles */
import {
  CustomerCard,
  DetailInfoCard,
  DocumentRow,
  Header,
  SafeAreaWrapper,
  Spacing,
  theme,
  Loader,
  Text,
  Pressable,
  FullLoader,
} from '@caryaar/components';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';

const Partner_Detail_Component = ({
  onBackPress,
  contactDetails,
  locationDetail,
  accountDetail,
  documents = [],
  isFetchingDocument,
  businessType,
  infoRowDetails,
  footerInfo,
  onEditPartnerDetail,
  businessName,
  isLoading,
  onViewGoogleMapPress,
}) => {
  return (
    <SafeAreaWrapper backgroundColor={theme.colors.background}>
      <Header title="Partner Details" onBackPress={onBackPress} />

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Partner summary card */}
        <View style={styles.customerWrapper}>
          <CustomerCard
            hideLogo
            brandName={businessType}
            customerName={businessName}
            infoRowDetails={infoRowDetails}
            footerInfo={footerInfo}
            wrapperColor={theme.colors.gray900}
            customerNameColor={theme.colors.white}
            infoWrapperColor={theme.colors.primaryBlack}
            infoValueColor={theme.colors.white}
            noMargin
            noShadow
            showButton
            buttonLabel="Edit Details"
            onButtonPress={onEditPartnerDetail}
            customerNameProp={{hankenGroteskBold: true}}
          />
        </View>

        {/* All detailed sections */}
        <View style={styles.sectionWrapper}>
          {/* Contact Info */}
          <DetailInfoCard label="Contact Details" data={contactDetails} />

          <Spacing size="lg" />

          {/* Location Info with map placeholder */}
          <DetailInfoCard label="Location Details" data={locationDetail} bottom>
            <View style={{marginTop: 12}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text type="helper-text" size="caption">
                  Google Map Location
                </Text>
                <Pressable onPress={onViewGoogleMapPress}>
                  <Text
                    size="caption"
                    hankenGroteskBold
                    color={theme.colors.primary}>
                    View In Google Map
                  </Text>
                </Pressable>
              </View>
              <View style={styles.mapPlaceholder} />
            </View>
          </DetailInfoCard>

          <Spacing size="lg" />

          {/* Documents */}
          <DetailInfoCard label="Business Documents">
            {documents.map((doc, index) => {
              return (
                <React.Fragment key={`doc-${doc.label || index}`}>
                  <DocumentRow
                    label={doc.label}
                    actionLabel={
                      doc.isMissing || !doc.uploaded ? 'Required' : 'View'
                    }
                    showError={doc.isMissing || !doc.uploaded}
                    disabled={doc.isMissing || !doc.uploaded}
                    onPress={doc?.onPress}
                    // isLoading={
                    //   isFetchingDocument?.loading &&
                    //   isFetchingDocument?.documentType === doc.documentType
                    // }
                  />
                  {/* Spacing between rows */}
                  {index !== documents.length - 1 && (
                    <Spacing size={theme.sizes.spacing.smd} />
                  )}
                </React.Fragment>
              );
            })}
          </DetailInfoCard>

          <Spacing size="lg" />

          {/* Account Info */}
          <DetailInfoCard label="Account Details" data={accountDetail} />
        </View>
      </ScrollView>
      {isLoading && <Loader visible={isLoading} />}
      {isFetchingDocument?.loading && (
        <FullLoader visible={isFetchingDocument?.loading} />
      )}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  customerWrapper: {
    backgroundColor: theme.colors.primaryBlack,
    padding: theme.sizes.padding,
    paddingTop: 12,
  },
  sectionWrapper: {
    padding: theme.sizes.padding,
  },
  mapPlaceholder: {
    backgroundColor: '#FF5B5E70', // Semi-transparent red placeholder
    height: 92,
    borderRadius: theme.sizes.borderRadius.card,
    marginTop: 8,
  },
});

export default Partner_Detail_Component;
