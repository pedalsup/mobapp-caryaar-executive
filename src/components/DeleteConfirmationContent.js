/* eslint-disable react-native/no-inline-styles */
import {CommonModal, Text, theme} from '@caryaar/components';
import {ActivityIndicator, View} from 'react-native';

const DeleteConfirmationContent = ({
  isVisible,
  onPressPrimaryButtonPress,
  onModalHide,
  primaryButtonLabel = 'Delete',
  title,
  message,
  isLoading = false,
}) => {
  return (
    <CommonModal
      isVisible={isVisible}
      onModalHide={onModalHide}
      primaryButtonLabel={primaryButtonLabel}
      isScrollableContent={true}
      isPrimaryButtonVisible={true}
      onPressPrimaryButton={onPressPrimaryButtonPress}
      title={title}
      tittleColor={theme.colors.error}
      restPrimaryButtonProp={{
        bgColor: theme.colors.error,
        themedColor: 'white',
        variant: 'ghost',
      }}>
      <View style={{paddingVertical: 5}}>
        {isLoading && (
          <ActivityIndicator
            size={'large'}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}
        <Text textAlign="center" lineHeight={22}>
          {message}
        </Text>
      </View>
    </CommonModal>
  );
};

export default DeleteConfirmationContent;
