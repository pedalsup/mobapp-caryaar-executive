import React from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const FullLoader = ({visible = false}) => {
  return (
    <View style={styles.loaderStyle}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

export default FullLoader;

const styles = StyleSheet.create({
  loaderStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
