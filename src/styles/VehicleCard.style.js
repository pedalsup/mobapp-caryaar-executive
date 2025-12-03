import {StyleSheet} from 'react-native';
import {theme} from '@caryaar/components';

export const styles = StyleSheet.create({
  container: {
    padding: 5,
    borderRadius: 12,
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  cardWrapper: {
    backgroundColor: theme.colors.primaryBlack,
    borderRadius: 12,
    padding: 12,
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 8,
    marginRight: 12,
  },
  details: {
    flex: 1,
  },

  plateWrapper: {
    flexDirection: 'row',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginVertical: 4,
    alignSelf: 'flex-start',
    borderWidth: 2,
  },
  plateLogo: {
    width: 20,
    height: 14,
    marginRight: 6,
  },
  plateText: {
    letterSpacing: 2,
  },
});
