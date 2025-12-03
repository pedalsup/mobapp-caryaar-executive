import {StyleSheet} from 'react-native';
import {theme} from '@caryaar/components';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.sizes.padding,
  },
  inputStyle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.h4,
    textAlign: 'center',
    ...theme.typography.fontStyles.hankenGroteskBold,
  },
});
