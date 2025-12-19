import {DocumentRow, Spacing, Text, theme} from '@caryaar/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {DOCUMENT_LABELS, KYC_LABELS} from '../../constants/enums';

const DocumentList = ({
  isLoading,
  kycDocuments,
  onDocumentPress,
  documentType,
  loanDocumentList,
}) => {
  const safeKycDocs =
    kycDocuments && typeof kycDocuments === 'object' ? kycDocuments : {};

  return (
    <>
      {/* KYC Documents */}
      <Text type={'helper-text'} hankenGroteskMedium={true}>
        KYC Documents
      </Text>
      <Spacing size="sm" />
      {Object.entries(KYC_LABELS).map(([key, label]) => {
        const hasDocument = safeKycDocs?.[key];

        return (
          <React.Fragment key={key}>
            <DocumentRow
              label={label}
              actionLabel={hasDocument ? 'View' : 'Request Documents'}
              isLoading={isLoading && documentType === key}
              disabled={isLoading}
              onPress={() => {
                onDocumentPress?.(key, safeKycDocs[key], hasDocument);
              }}
              showError={!hasDocument}
            />
            <Spacing size="smd" />
          </React.Fragment>
        );
      })}

      <View style={styles.divider} />

      {/* Loan Documents */}
      <Text type={'helper-text'} hankenGroteskMedium={true}>
        Loan Documents
      </Text>
      <Spacing size="sm" />

      {loanDocumentList?.map((item, index) => {
        const {type, label, docObject} = item;
        const hasDocument = !!docObject;
        const isLastItem = index === loanDocumentList.length - 1;

        return (
          <React.Fragment key={type}>
            <DocumentRow
              label={label}
              actionLabel={hasDocument ? 'View' : 'Request Documents'}
              isLoading={isLoading && documentType === type}
              disabled={isLoading}
              onPress={() => {
                onDocumentPress?.(type, docObject?.uri, hasDocument);
              }}
              showError={!hasDocument}
            />
            <Spacing size={isLastItem ? 0 : 'smd'} />
          </React.Fragment>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: theme.sizes.spacing.smd,
  },
});

export default DocumentList;
