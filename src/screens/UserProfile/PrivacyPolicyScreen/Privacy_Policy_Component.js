/* eslint-disable react-native/no-inline-styles */
import {Card, Header, SafeAreaWrapper, Text, theme} from '@caryaar/components';
import React from 'react';
import {ScrollView, View} from 'react-native';
import {goBack} from '../../../navigation/NavigationUtils';

const Privacy_Policy_Component = ({params}) => {
  return (
    <SafeAreaWrapper backgroundColor={theme.colors.background}>
      <Header title="Privacy Policy" onBackPress={() => goBack()} />
      <View
        style={{
          flex: 1,
          padding: 24,
          backgroundColor: theme.colors.background,
        }}>
        {/* padding */}
        <Card>
          <ScrollView>
            <Text size={'small'} type={'caption'}>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. It has
              survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was
              popularised in the 1960s with the release of Letraset sheets
              containing Lorem Ipsum passages, and more recently with desktop
              publishing software like Aldus PageMaker including versions of
              Lorem Ipsum.
              {'\n\n'}
              It is a long established fact that a reader will be distracted by
              the readable content of a page when looking at its layout. The
              point of using Lorem Ipsum is that it has a more-or-less normal
              distribution of letters, as opposed to using 'Content here,
              content here', making it look like readable English. Many desktop
              publishing packages and web page editors now use Lorem Ipsum as
              their default model text, and a search for 'lorem ipsum' will
              uncover many web sites still in their infancy. Various versions
              have evolved over the years, sometimes by accident, sometimes on
              purpose (injected humour and the like).
              {'\n\n'}
              Contrary to popular belief, Lorem Ipsum is not simply random text.
              It has roots in a piece of classical Latin literature from 45 BC.
            </Text>
          </ScrollView>
        </Card>
      </View>
    </SafeAreaWrapper>
  );
};

export default Privacy_Policy_Component;
