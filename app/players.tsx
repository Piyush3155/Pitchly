import { Stack } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { PlayerCard } from '@/components';
import { ThemedView } from '@/components/themed-view';

// Mock data - replace with real API data
const mockPlayers = [
  {
    id: '1',
    name: 'Virat Kohli',
    role: 'batsman',
    team: 'India',
    stats: {
      matches: 254,
      runs: 12169,
      wickets: 0,
      average: 59.07,
      strikeRate: 93.17,
    },
  },
  {
    id: '2',
    name: 'Jasprit Bumrah',
    role: 'bowler',
    team: 'India',
    stats: {
      matches: 121,
      runs: 345,
      wickets: 145,
      average: 24.54,
      strikeRate: 14.2,
      economy: 4.62,
    },
  },
  {
    id: '3',
    name: 'Steve Smith',
    role: 'batsman',
    team: 'Australia',
    stats: {
      matches: 132,
      runs: 7521,
      wickets: 17,
      average: 56.97,
      strikeRate: 85.44,
    },
  },
  {
    id: '4',
    name: 'Kagiso Rabada',
    role: 'bowler',
    team: 'South Africa',
    stats: {
      matches: 98,
      runs: 567,
      wickets: 132,
      average: 26.78,
      strikeRate: 16.8,
      economy: 4.89,
    },
  },
  {
    id: '5',
    name: 'Ben Stokes',
    role: 'all-rounder',
    team: 'England',
    stats: {
      matches: 102,
      runs: 2922,
      wickets: 89,
      average: 35.52,
      strikeRate: 91.95,
    },
  },
];

export default function PlayersScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Players',
          headerShown: true,
        }}
      />

      <FlatList
        data={mockPlayers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlayerCard
            player={item}
            onPress={() => {
              // Navigate to player details
              console.log('Navigate to player:', item.id);
            }}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: 16,
  },
});