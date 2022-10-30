import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {shuffleArray} from '../common/functions';
import ThemeContext from '../common/ThemeContext';
import AppScreen from '../components/AppScreen';
import AppText from '../components/AppText';
import {sizes} from '../constants/theme';
import {CardValues} from '../models/CardValues';


function Home() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [cardValues, setCardValues] = useState<CardValues[]>([]);
  const [isExecutionPaused, setIsExecutionPaused] = useState<boolean>(false);
  const [letterCount, setLetterCount] = useState<number>(6);
  const [noOfTurns, setNoOfTurns] = useState<number>(0);
  const [pairCount, setPairCount] = useState<number>(0);
  const [isAllMatchFound, setIsAllMatchFound] = useState<boolean>(false);

  const resetData = () => {
    const shuffledStrings = shuffleArray(letterCount);
    const mockCardObject: any = shuffledStrings.map(
      (value, index) => ({
        id: index,
        value: value,
        isVisible: false,
        isFound: false,
      }),
    );
    setCardValues(mockCardObject);
    setIsAllMatchFound(false);
    setNoOfTurns(0);
    setPairCount(0);
  };

  useEffect(() => {
      resetData();
    }, []);

  const checkIfAllMatchesAreFound = () => {
    const matchedCards = cardValues.filter(currentVal => currentVal.isFound);
    setPairCount(matchedCards.length / 2);
    if (matchedCards.length === cardValues.length) {
      setIsAllMatchFound(true);
    }
  };

  const checkForMatchingCards = () => {
    const openCardsValues = cardValues.filter(
      currentVal => currentVal.isVisible,
    );
    if (openCardsValues.length === 2) {
      setNoOfTurns(noOfTurns + 1);
      setIsExecutionPaused(true);
      setTimeout(() => {
        if (openCardsValues[0].value === openCardsValues[1].value) {
          cardValues[openCardsValues[0].id].isFound = true;
          cardValues[openCardsValues[1].id].isFound = true;
          checkIfAllMatchesAreFound();
        }
        cardValues[openCardsValues[0].id].isVisible = false;
        cardValues[openCardsValues[1].id].isVisible = false;
        setCardValues([...cardValues]);
        setIsExecutionPaused(false);
      }, 1000);
    }
  };

  const onCardPress = (item: CardValues, index: number) => {
    if (!isExecutionPaused && !item.isFound) {
      cardValues[index].isVisible = true;
      setCardValues([...cardValues]);
      checkForMatchingCards();
    }
  };

  const setCardStyle = (item: CardValues) => {
    if (item.isFound) {
      return [styles(theme).card, styles(theme).completedCards];
    } else if (item.isVisible) {
      return [styles(theme).card, styles(theme).openCard];
    } else {
      return [styles(theme).card];
    }
  };

  const ScoreCard = () => (
    <View style={styles(theme).scoreCard}>
      <AppText style={styles(theme).scoreCardText}>
        Pairs Found: {pairCount}
      </AppText>
      <AppText style={styles(theme).scoreCardText}>Steps: {noOfTurns}</AppText>
    </View>
  );

  const RenderCards = ({item, index}: {item: CardValues; index: number}) => (
    <TouchableOpacity
      onPress={() => onCardPress(item, index)}
      style={setCardStyle(item)}>
      {item.isVisible && (
        <AppText style={styles(theme).cardText}>{''+item.value}</AppText>
      )}
    </TouchableOpacity>
  );

  useEffect(() => {
    if (isAllMatchFound) {
      showCongratsAlert();
    }
  }, [isAllMatchFound]);

  const showCongratsAlert = () => {
    Alert.alert('Congratulations!!!', 'Level Completed!', [
      {text: 'RESTART', onPress: () => resetData()},
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
      }}>
      <AppScreen style={styles(theme).container}>
        <ScoreCard />
        <FlatList
          data={cardValues}
          keyExtractor={(item, index) => index.toString()}
          renderItem={RenderCards}
          showsVerticalScrollIndicator={false}
          numColumns={4}
        />
        <View style={styles(theme).bottomContainer}>
          <TouchableOpacity
            onPress={() => resetData()}
            style={styles(theme).resetButton}>
            <AppText style={styles(theme).resetText}>Restart</AppText>
          </TouchableOpacity>
        </View>
      </AppScreen>
    </View>
  );
}

const styles = (theme?: {[key: string]: string}) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    scoreCard: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      width: '100%',
      padding: sizes.padding,
    },
    scoreCardText: {
      fontWeight: '700',
      fontSize: sizes.title,
    },
    card: {
      backgroundColor: theme?.purple,
      borderColor: theme?.disabledPrimary,
      margin: 10,
      width: '18%',
      height: 100,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: sizes.radius,
    },
    cardText: {
      color: theme?.white,
      fontWeight: '700',
      fontSize: sizes.h1,
    },
    completedCards: {
      backgroundColor: theme?.disabledPrimary,
    },
    openCard: {
      backgroundColor: theme?.purple,
    },
    bottomContainer: {
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-evenly',
    },
    resetButton: {
      backgroundColor: theme?.red,
      paddingHorizontal: 20,
      paddingVertical: 10,
      marginTop: 10,
      borderRadius: sizes.radius,
    },
    resetText: {
      color: theme?.white,
    },
    radioButtonContainer: {
      flexDirection: 'row',
    },
    radioButtonTitle: {
      marginTop: 15,
    },
  });

export default Home;
