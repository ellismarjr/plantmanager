import { useNavigation, useRoute } from '@react-navigation/core';
import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  StyleSheet
} from 'react-native';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface Params {
  title: string;
  subtitle: string;
  buttonTitle: string;
  icon: 'smile' | 'hug';
  nextScreen: string;
}

const emojis = {
  hug: '🤗',
  smile: '😃'
}

export function Confirmation() {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    title,
    subtitle,
    buttonTitle,
    icon,
    nextScreen
  } = route.params as Params;
  
  function handleMoveOn() {
    navigation.navigate(nextScreen);
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>
          {emojis[icon]}
        </Text>
        <Text style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle}>
         {subtitle}
        </Text>
        <View style={styles.footer}>
          <Button title={buttonTitle} onPress={handleMoveOn}/>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: 20
  },
  emoji: {
    fontSize: 72
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.heading,
    textAlign: 'center',
    lineHeight: 38,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    textAlign: 'center',
    fontSize: 17,
    paddingVertical: 10,
    color: colors.heading
  },
  footer: {
    width: '100%',
    paddingHorizontal: 50
  }
});