import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  Alert
} from 'react-native';
import { formatDistance } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { Header } from '../components/Header';

import waterDopImg from '../assets/waterdrop.png';


import colors from '../styles/colors';
import { IPlant, loadPlants, removePlant } from '../libs/storage';
import fonts from '../styles/fonts';
import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Loading } from '../components/Loading';



export function MyPlants() {
  const [plants, setPlants] = useState<IPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>();

  function handleRemove(plant: IPlant) {
    Alert.alert('Remover', `Desejar remover a ${plant.name}?`, [
      {
        text: 'Não ',
        style: 'cancel'
      },
      {
        text: 'Sim',
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setPlants(oldData => oldData.filter(item => item.id !== plant.id))
          } catch (error) {
            Alert.alert('Não foi possível remover!')
          }
        }
      }
    ])
  }

  useEffect(() => {
    async function loadStorageData() {
      const plants = await loadPlants();

      if (plants) {
        const nextTime = formatDistance(new Date(plants[0].dateTimeNotification).getTime(),
          new Date().getTime(),
          { locale: ptBR }
        );

        setNextWaterd(
          `Não esqueça de regar a ${plants[0].name} à ${nextTime}`
        );
        setPlants(plants);

      }
      setLoading(false);
    }

    loadStorageData();
  }, []);

  if (loading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.spotlight}>
        <Image
          source={waterDopImg}
          style={styles.spotlightImage}
        />
        <Text style={styles.spotlightText}>{nextWaterd}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>
          Próximas regadas
        </Text>

        <FlatList
          data={plants}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary
              handleRemove={() => handleRemove(item)}
              data={item} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  spotlightImage: {
    width: 60,
    height: 60
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%'
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 10
  }
});