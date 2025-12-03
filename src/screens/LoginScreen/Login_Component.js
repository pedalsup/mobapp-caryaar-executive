/* eslint-disable react-native/no-inline-styles */
import {
  Button,
  Card,
  images,
  Input,
  SafeAreaWrapper,
  Spacing,
  Text,
  theme,
} from '@caryaar/components';
import React from 'react';
import {Image, KeyboardAvoidingView, Platform, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import strings from '../../locales/strings';
import {styles} from '../../styles/Login.style';

const Login_Component = ({
  params,
  mobileNumber,
  setMobileNumber,
  generateOTP,
  isError,
}) => {
  const [caretHidden, setCaretHidden] = React.useState(false);

  return (
    <SafeAreaWrapper
      barStyle="dark-content"
      statusBarColor={theme.colors.authGradient[0]}
      backgroundColor={theme.colors.authGradient[1]}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <LinearGradient
          style={styles.wrapper}
          colors={theme.colors.authGradient}>
          <View style={styles.container}>
            <View style={{alignItems: 'center'}}>
              <Text
                hankenGroteskExtraBold={true}
                size={28}
                color={theme.colors.primary}>
                CarYaar
              </Text>
              <Spacing size="md" />
              <Text
                hankenGroteskBold={true}
                size={theme.typography.fontSizes.h1}
                color={theme.colors.black}>
                {strings.welcomeBack}
              </Text>
              <Spacing />
              <Text type={'helper-text'}>{strings.welcomeNote}</Text>
            </View>
            <Spacing size="xl" />
            <Card noShadow={true}>
              <View style={styles.label}>
                <Image
                  source={images.callOutline}
                  style={styles.labelIcon}
                  resizeMode="contain"
                />
                <Text
                  type={'helper-text'}
                  color={theme.colors.textSecondary}
                  lineHeight={theme.typography.lineHeights.small}>
                  {strings.enterMobile}
                </Text>
              </View>
              <Input
                // placeholder="98744 32092"
                optionalLabelContainerStyles={{alignSelf: 'center'}}
                inputStyles={styles.inputStyle}
                value={mobileNumber}
                onChangeText={value => {
                  setMobileNumber?.(value);
                  setCaretHidden(!(value.length > 0));
                }}
                maxLength={10}
                keyboardType="number-pad"
                isError={isError}
                statusMsg={'Please enter a valid mobile number.'}
                autoFocus
                returnKeyType={'done'}
                onSubmitEditing={generateOTP}
              />
              <Spacing size="xl" />
              <Button label={strings.generateOTP} onPress={generateOTP} />
            </Card>
          </View>
        </LinearGradient>
      </KeyboardAvoidingView>
    </SafeAreaWrapper>
  );
};

export default Login_Component;
