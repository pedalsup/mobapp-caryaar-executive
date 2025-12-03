import {StyleSheet} from 'react-native';
import {theme} from '@caryaar/components';

export const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  header: {fontSize: 20, fontWeight: 'bold', marginBottom: 12},
  row: {justifyContent: 'space-between'},
  wrapper: {
    flexGrow: 1,
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.background,
  },
});
