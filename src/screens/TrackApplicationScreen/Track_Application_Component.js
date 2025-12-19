/* eslint-disable react-native/no-inline-styles */
import {
  Card,
  Header,
  Loader,
  SafeAreaWrapper,
  Spacing,
  Text,
  theme,
} from '@caryaar/components';
import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {formatDate} from '../../utils/helper';
import {NoDataFound} from '../../components';
import {goBack} from '../../navigation/NavigationUtils';

export default function LoanTrackingScreen({
  navigation,
  loading,
  trackingSteps,
  loanApplicationId,
}) {
  const handleStepPress = (step, index) => {
    // navigation.navigate('StepDetail', { step, index });
  };

  return (
    <SafeAreaWrapper backgroundColor={theme.colors.background}>
      <Header title="Loan Application Tracking" onBackPress={() => goBack()} />
      <View
        style={{
          padding: theme.sizes.padding,
          flex: 1,
        }}>
        <Text style={styles.trackingId}>
          Tracking ID <Text style={styles.id}>{loanApplicationId}</Text>
        </Text>
        <Spacing size="md" />
        {trackingSteps && trackingSteps.length > 0 ? (
          <Card padding={0}>
            <ScrollView
              contentContainerStyle={styles.scroll}
              showsVerticalScrollIndicator={false}>
              <View style={styles.timeline}>
                {trackingSteps.map((item, index) => {
                  // const completed = item?.step === 'LOAN_APPLICATION_CREATED';
                  const completed = true;
                  const isLast = index === trackingSteps.length - 1;

                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleStepPress(item, index)}
                      activeOpacity={0.7}>
                      <View
                        style={[
                          styles.stepContainer,
                          !isLast && styles.stepContainerBorder,
                          isLast && {marginBottom: 0},
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
                            size={15}
                            style={[
                              completed ? styles.textDone : styles.textPending,
                              isLast && styles.finalNote,
                            ]}>
                            {item?.recentActivity?.description}
                          </Text>
                          <Text style={styles.timestamp}>
                            {formatDate(
                              item?.createdAt,
                              'DD MMM YYYY, hh:mm A',
                            )}
                          </Text>
                          {/* {completed && (
                          <Text style={styles.timestamp}>
                            12 Jan 2025, 3:30 PM
                          </Text>
                        )} */}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </Card>
        ) : (
          <NoDataFound />
        )}
        <Spacing size="xl" />
      </View>
      {loading && <Loader visible={loading} />}
    </SafeAreaWrapper>
  );
}

const CIRCLE_SIZE = 14;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {backgroundColor: '#000', padding: 16},
  title: {color: '#fff', fontSize: 18, fontWeight: '600'},
  id: {color: '#FFA500'},
  scroll: {flexGrow: 1, padding: 12},
  timeline: {paddingLeft: 0},

  stepContainer: {
    flexDirection: 'row',
    marginBottom: 32,
    alignItems: 'flex-start',
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
    height: 60,
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

  stepText: {
    fontSize: 15,
    fontWeight: '500',
  },

  textDone: {color: '#000'},
  textPending: {color: '#9ca3af'},
  timestamp: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },

  finalNote: {
    fontSize: 14,
    color: '#16a34a',
    marginTop: 4,
  },
  stepContainerBorder: {
    // borderBottomWidth: 1,
    // borderBottomColor: '#e5e7eb',
    // paddingBottom: 20,
  },
});
