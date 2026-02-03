import {
  Card,
  Header,
  SafeAreaWrapper,
  Text,
  theme,
  Spacing,
} from '@caryaar/components';
import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {goBack} from '../../../navigation/NavigationUtils';
import images from '../../../assets/images';

const Contact_Support_Component = ({params}) => {
  return (
    <SafeAreaWrapper>
      <Header title={'Help & Support'} onBackPress={() => goBack()} />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Card>
          <Text color={theme.colors.textSecondary}>
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old.
          </Text>
          <Spacing size={'lg'} />
          <Text color={theme.colors.textSecondary}>Contact Us</Text>
          <View style={styles.itemRow}>
            <Image
              source={images.icEmailRound}
              resizeMode="contain"
              style={styles.iconStyle}
            />
            <Text
              size={'body'}
              hankenGroteskSemiBold={true}
              lineHeight={'body'}>
              support@caryaar.in
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Image
              source={images.icPhoneRound}
              resizeMode="contain"
              style={styles.iconStyle}
            />
            <Text
              size={'body'}
              hankenGroteskSemiBold={true}
              lineHeight={'body'}>
              +91-XXXXXXXXXX
            </Text>
          </View>
          <Spacing size={'lg'} />
          <Text color={theme.colors.textSecondary}>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.
          </Text>
        </Card>
      </ScrollView>
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: theme.colors.background,
    padding: theme.sizes.padding,
    flexGrow: 1,
  },
  itemRow: {
    flexDirection: 'row',
    marginTop: theme.sizes.spacing.md,
    alignItems: 'center',
  },
  iconStyle: {
    height: theme.sizes.icons.xxl,
    width: theme.sizes.icons.xxl,
    marginRight: theme.sizes.spacing.md,
  },
});

export default Contact_Support_Component;
