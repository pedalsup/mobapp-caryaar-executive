import {StyleSheet} from 'react-native';
import {theme} from '@caryaar/components';

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  mainContainer: {flex: 1, paddingHorizontal: theme.sizes.padding},

  container: {
    flex: 1,
    // alignItems: 'center',
  },
  label: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
});
