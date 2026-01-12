import React, {useCallback, useRef, useState} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  Button,
  Card,
  Header,
  images,
  Input,
  Pressable,
  SafeAreaWrapper,
  Spacing,
  Text,
  FilePickerModal,
  theme,
  FullLoader,
  DropdownModal,
  Loader,
} from '@caryaar/components';
import {goBack} from '../../../navigation/NavigationUtils';
import {salesExecOptions} from '../../../constants/enums';

const Edit_Profile_Component = ({
  handleSavePress,
  state,
  onFullNameChange,
  onEmailChange,
  onMobileChange,
  onSalesPositionSelection,
  salesExecutivePosition,
  handleFile,
  closeFilePicker,
  showFilePicker,
  onEditProfilePicPress,
  profileImage,
  onDeleteProfileImage,
  viewProfileImage,
  restInputProps,
  isLoading,
  isLoadingDocument,
}) => {
  const [showSalesExecutiveDropdown, setShowSalesExecutiveDropdown] =
    useState(false);

  const refs = {
    fullName: useRef(null),
    email: useRef(null),
    mobileNumber: useRef(null),
    salesExecutivePosition: useRef(null),
  };

  const focusNext = key => {
    refs[key]?.current?.focus();
  };

  const handleDropdownSelect = useCallback(
    (item, index) => {
      onSalesPositionSelection?.(item, index);
      setShowSalesExecutiveDropdown(false);
    },
    [onSalesPositionSelection],
  );

  const renderProfileCard = () => (
    <View style={styles.profileCard}>
      <Pressable onPress={onEditProfilePicPress}>
        <Image source={images.edit_profile} style={styles.iconImage} />
      </Pressable>
      <Pressable onPress={viewProfileImage}>
        <Image
          source={profileImage ? {uri: profileImage} : images.placeholder_image}
          style={styles.profilePic}
          defaultSource={images.placeholder_image}
        />
      </Pressable>
      <Pressable onPress={onDeleteProfileImage}>
        <Image source={images.ic_delete} style={styles.iconImage} />
      </Pressable>
    </View>
  );

  return (
    <SafeAreaWrapper>
      <Header title="Edit Profile" onBackPress={goBack} />
      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={styles.wrapper}>
        <View style={styles.profileWrapper}>{renderProfileCard()}</View>
        <View style={styles.formContainer}>
          <Text>Personal Details</Text>
          <Spacing size="smd" />
          <Card>
            <Input
              ref={refs.fullName}
              label="Full Name"
              leftIconName={images.user}
              isLeftIconVisible
              value={state.fullName}
              onChangeText={onFullNameChange}
              returnKeyType="next"
              onSubmitEditing={() => focusNext('email')}
              {...(restInputProps.fullName || {})}
            />
            <Spacing size="smd" />
            <Input
              ref={refs.email}
              label="Email Address"
              leftIconName={images.email}
              isLeftIconVisible
              value={state.email}
              onChangeText={onEmailChange}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => focusNext('mobileNumber')}
              {...(restInputProps.email || {})}
            />
            <Spacing size="smd" />
            <Input
              isDisabled
              ref={refs.mobileNumber}
              label="Mobile Number"
              leftIconName={images.callOutline}
              isLeftIconVisible
              value={state.mobileNumber}
              onChangeText={onMobileChange}
              keyboardType="phone-pad"
              maxLength={10}
              returnKeyType="next"
              onSubmitEditing={() => focusNext('salesExecutivePosition')}
              {...(restInputProps.mobileNumber || {})}
            />
            <Spacing size="smd" />
            <Input
              ref={refs.salesExecutivePosition}
              label="Sales Executive Position"
              leftIconName={images.businessSuitcase}
              isLeftIconVisible
              isAsDropdown
              isRightIconVisible={false}
              value={salesExecutivePosition}
              onPress={() => setShowSalesExecutiveDropdown(true)}
              {...(restInputProps.salesExecutivePosition || {})}
              isDisabled
              rightIcnDisable={true}
            />
          </Card>
          <Spacing size="xl" />
          <Button label="Save" onPress={handleSavePress} />
        </View>
      </KeyboardAwareScrollView>

      <DropdownModal
        visible={showSalesExecutiveDropdown}
        data={salesExecOptions}
        selectedItem={salesExecutivePosition}
        onSelect={handleDropdownSelect}
        onClose={() => setShowSalesExecutiveDropdown(false)}
        title="Select Sales Executive Position"
      />

      <FilePickerModal
        isVisible={showFilePicker}
        onSelect={handleFile}
        onClose={closeFilePicker}
        autoCloseOnSelect={false}
        options={[
          {label: 'Camera', value: 'camera', icon: images.file_camera},
          {label: 'Photo Gallery', value: 'gallery', icon: images.file_gallery},
        ]}
      />

      {isLoading && <Loader visible={isLoading} />}

      {isLoadingDocument && <FullLoader visible={isLoadingDocument} />}
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  profileWrapper: {
    backgroundColor: theme.colors.primaryBlack,
    padding: theme.sizes.padding,
    paddingTop: theme.sizes.spacing.md,
  },
  formContainer: {
    padding: theme.sizes.padding,
  },
  profileCard: {
    backgroundColor: theme.colors.gray900,
    padding: theme.sizes.spacing.smd,
    borderRadius: theme.sizes.borderRadius.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.sizes.spacing.lg,
  },
  profilePic: {
    height: 100,
    width: 100,
    borderRadius: theme.sizes.borderRadius.md,
  },
  iconImage: {
    height: theme.sizes.icons.lg,
    width: theme.sizes.icons.lg,
  },
});

export default Edit_Profile_Component;
