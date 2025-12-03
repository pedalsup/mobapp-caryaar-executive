import {StyleSheet} from 'react-native';
import {theme} from '@caryaar/components';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    // alignItems: 'center',
    paddingHorizontal: theme.sizes.padding,
    paddingTop: 45,
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  inputStyle: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.fontSizes.h4,
    fontFamily: theme.typography.fonts.hankenGroteskBold,
    fontWeight: theme.typography.fontWeights.bold,
    textAlign: 'center',
    flex: 1,
    paddingVertical: 0,
  },
  labelIcon: {
    height: theme.sizes.icons.smd,
    width: theme.sizes.icons.smd,
    marginRight: 8,
  },
});
