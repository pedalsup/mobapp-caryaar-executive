import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';

import {
  Card,
  Header,
  Loader,
  SafeAreaWrapper,
  Spacing,
  Text,
  theme,
} from '@caryaar/components';

import {NoDataFound} from '../../components';
import {formatDate} from '../../utils/helper';
import {goBack} from '../../navigation/NavigationUtils';

const LoanTrackingScreen = ({
  navigation,
  loading,
  trackingSteps,
  loanApplicationId,
}) => {
  const handleStepPress = (step, index) => {
    // navigation.navigate('StepDetail', { step, index });
  };

  const hasData = trackingSteps?.length > 0;

  return (
    <SafeAreaWrapper>
      <Header title="Loan Application Tracking" onBackPress={goBack} />

      <View style={styles.container}>
        <Text>
          Tracking ID{' '}
          <Text hankenGroteskBold color={'#FFA500'}>
            {loanApplicationId}
          </Text>
        </Text>

        {hasData ? (
          <Card
            padding={0}
            cardContainerStyle={{marginVertical: theme.sizes.spacing.smd}}>
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}>
              <View style={styles.timeline}>
                {trackingSteps.map((item, index) => {
                  const completed = true; // TODO: replace with real condition
                  const isLast = index === trackingSteps.length - 1;

                  return (
                    <TouchableOpacity
                      key={index}
                      activeOpacity={0.7}
                      onPress={() => handleStepPress(item, index)}>
                      <View
                        style={[
                          styles.stepContainer,
                          !isLast && styles.stepContainerBorder,
                          isLast && styles.lastStep,
                        ]}>
                        <View style={styles.markerWrapper}>
                          <View
                            style={[
                              styles.circle,
                              completed
                                ? styles.circleCompleted
                                : styles.circlePending,
                            ]}
                          />

                          {!isLast && (
                            <View
                              style={[
                                styles.verticalLine,
                                completed
                                  ? styles.lineCompleted
                                  : styles.linePending,
                              ]}
                            />
                          )}
                        </View>

                        <View style={styles.textContainer}>
                          <Text
                            type="helper-text"
                            style={[
                              completed ? styles.textDone : styles.textPending,
                              isLast && styles.finalNote,
                            ]}>
                            {item?.recentActivity?.description}
                          </Text>

                          <Text
                            size="caption"
                            color={theme.colors.gray500}
                            style={styles.timestamp}>
                            {formatDate(
                              item?.createdAt,
                              'DD MMM YYYY, hh:mm A',
                            )}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Card>
        ) : (
          !loading && <NoDataFound />
        )}

        <Spacing size="xl" />
      </View>

      {loading && <Loader visible />}
    </SafeAreaWrapper>
  );
};

const CIRCLE_SIZE = 14;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.sizes.padding,
    backgroundColor: theme.colors.background,
  },

  scroll: {
    flexGrow: 1,
    padding: 12,
  },

  timeline: {
    paddingLeft: 0,
  },

  stepContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  stepContainerBorder: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#e5e7eb',
    // paddingBottom: 20, // Border under the nite
  },

  lastStep: {
    marginBottom: 0,
  },

  markerWrapper: {
    width: 30,
    alignItems: 'center',
    position: 'relative',
  },

  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
  },

  circleCompleted: {
    borderColor: '#0ea5e9',
    backgroundColor: '#0ea5e9',
  },

  circlePending: {
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },

  verticalLine: {
    position: 'absolute',
    top: CIRCLE_SIZE + 2,
    width: 2,
    height: '100%',
  },

  lineCompleted: {
    backgroundColor: '#0ea5e9',
  },

  linePending: {
    backgroundColor: '#d1d5db',
  },

  textContainer: {
    marginLeft: 12,
    flex: 1,
  },

  textDone: {
    color: theme.colors.black,
  },

  textPending: {
    color: '#9ca3af',
  },

  timestamp: {
    marginTop: 4,
  },

  finalNote: {
    fontSize: 14,
    color: '#16a34a',
    marginTop: 4,
  },
});

export default LoanTrackingScreen;
