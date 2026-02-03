import React, {useState} from 'react';
import {
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  StyleSheet,
  UIManager,
  View,
} from 'react-native';

import {
  Card,
  Header,
  images,
  SafeAreaWrapper,
  Spacing,
  Text,
  theme,
} from '@caryaar/components';

import {goBack} from '../../../navigation/NavigationUtils';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const faqData = [
  {
    question: 'Lorem Ipsum is simply dummy text of the',
    answer: 'It is a long established fact that a reader will be distracted...',
  },
  {
    question: 'Ipsum doloribus sapiente nostrum facild',
    answer: 'Answer goes here...',
  },
  {
    question: 'Fugit numquam dicta in laborum quia',
    answer: 'Answer goes here...',
  },
  {
    question: 'Reiciendis quaerat dolores nihil, quosp.',
    answer: 'Answer goes here...',
  },
  {
    question: 'Commodi et nostrum nihil possimus',
    answer: 'Answer goes here...',
  },
  {
    question: 'Voluptate repellat fugit sit, vel, maie',
    answer:
      'poakd opakdpo akopdk oapkdop akp akpdkopa dopakop aopd opak opakop kaopk opakdo pakodp aksop kaopk opak opaksopd kaposk dpakdop akop aop opakop akop akop ',
  },
  {
    question: 'Possimus fugiat ullam quae omnis sapiee',
    answer: 'Answer goes here...',
  },
  {
    question: 'Numquam esse consequatur ullam vel n',
    answer: 'Answer goes here...',
  },
];

const AccordionItem = ({item, isExpanded, onPress}) => (
  <>
    <Card padding={16} noShadow={true} onPress={onPress}>
      <View style={styles.header}>
        <Text
          size={'small'}
          hankenGroteskSemiBold={!isExpanded}
          hankenGroteskBold={isExpanded}>
          {item.question}
        </Text>
        <Image
          source={isExpanded ? images.arrow_up : images.arrow_down}
          resizeMode="contain"
          style={{height: 20, width: 20}}
        />
      </View>
      {isExpanded && (
        <>
          <Spacing size="xs" />
          <Text
            size={'small'}
            color={theme.colors.textSecondary}
            lineHeight={'small'}>
            {item.answer}
          </Text>
        </>
      )}
    </Card>
    <Spacing size="smd" />
  </>
);

const FAQ_Component = ({params}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = index => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(index === expandedIndex ? null : index);
  };
  return (
    <SafeAreaWrapper>
      <Header title="FAQs" onBackPress={() => goBack()} />
      <FlatList
        bounces={false}
        data={faqData}
        contentContainerStyle={styles.container}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <AccordionItem
            item={item}
            isExpanded={expandedIndex === index}
            onPress={() => toggleExpand(index)}
          />
        )}
      />
    </SafeAreaWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    padding: theme.sizes.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default FAQ_Component;
