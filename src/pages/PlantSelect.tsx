import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { EnviromentButton } from '../components/EnviromentButton';

import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import { Loading } from '../components/Loading';

import api from '../services/api';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

interface IEnviroment {
  key: string;
  title: string;
}

interface IPlants {
  id: string,
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string],
  frequency: {
    times: number;
    repeat_every: string;
  }
}

export function PlantSelect() {
  const [enviroments, setEnviroments] = useState<IEnviroment[]>([]);
  const [plants, setPlants] = useState<IPlants[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<IPlants[]>([]);
  const [enviromentSeletect, setEnviromentSeletect] = useState('all');
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadedAll, setLoadedAll] = useState(false)

  function handleEnviromentSeletect(enviroment: string) {
    setEnviromentSeletect(enviroment);

    if (enviroment === 'all') {
      return setFilteredPlants(plants);
    }

    const filtered = plants.filter(plant =>
      plant.environments.includes(enviroment));

    setFilteredPlants(filtered);
  }

  async function loadPlants() {
    const response = await api.get(`plants?_sort=name&order=asc&_page=${page}&_limit=8`);

    if (response.data.length === 0) {
      setLoadingMore(false);
      return;
    }

    if (page > 1) {
      setPlants(prevArray => [...prevArray, response.data]);
      setFilteredPlants(prevArray => [...prevArray, response.data]);
    } else {
      setPlants(response.data);
      setFilteredPlants(response.data);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  async function handleLoadMore(distance: number) {
    if (distance < 1) {
      return;
    }

    setLoadingMore(true);
    setPage(oldValue => oldValue + 1);
    loadPlants();
  }

  useEffect(() => {
    async function loadEnviroment() {
      const response = await api.get('plants_environments?_sort=title&order=asc');
      setEnviroments([
        {
          key: 'all',
          title: 'Todos'
        },
        ...response.data
      ]);
    }

    loadEnviroment();
  }, []);

  useEffect(() => {
    loadPlants();
  }, []);

  if (loading) {
    return <Loading />
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>
          Em qual ambiente
        </Text>
        <Text style={styles.subtitle}>
          você quer colocar sua planta?
        </Text>
      </View>

      <View>
        <FlatList
          data={enviroments}
          renderItem={({ item }) => <EnviromentButton
            active={item.key === enviromentSeletect}
            onPress={() => handleEnviromentSeletect(item.key)}
            title={item.title} />}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PlantCardPrimary data={item} />}
          showsVerticalScrollIndicator={false}
          numColumns={2}
          onEndReachedThreshold={0.1}
          onEndReached={({ distanceFromEnd }) => handleLoadMore(distanceFromEnd)}
          ListFooterComponent={
            loadingMore
              ? <ActivityIndicator color={colors.green} />
              : <></>}
        />
      </View>
    </View>


  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  header: {
    paddingHorizontal: 30
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading
  },
  enviromentList: {
    height: 40,
    justifyContent: 'center',
    paddingBottom: 5,
    marginLeft: 30,
    marginVertical: 32
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center'
  }
});