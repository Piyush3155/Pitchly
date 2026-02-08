import { Stack } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { TeamCard } from '@/components';
import { ThemedView } from '@/components/themed-view';

// Mock data - replace with real API data
const mockTeams = [
  {
    id: '1',
    name: 'India',
    shortName: 'IND',
    flag: '🇮🇳',
    captain: 'Rohit Sharma',
    coach: 'Rahul Dravid',
    matchesPlayed: 45,
    wins: 32,
    losses: 10,
    draws: 3,
    points: 64,
  },
  {
    id: '2',
    name: 'Australia',
    shortName: 'AUS',
    flag: '🇦🇺',
    captain: 'Pat Cummins',
    coach: 'Andrew McDonald',
    matchesPlayed: 42,
    wins: 28,
    losses: 12,
    draws: 2,
    points: 56,
  },
  {
    id: '3',
    name: 'England',
    shortName: 'ENG',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    captain: 'Jos Buttler',
    coach: 'Matthew Mott',
    matchesPlayed: 38,
    wins: 22,
    losses: 14,
    draws: 2,
    points: 44,
  },
  {
    id: '4',
    name: 'South Africa',
    shortName: 'SA',
    flag: '🇿🇦',
    captain: 'Temba Bavuma',
    coach: 'Rob Walter',
    matchesPlayed: 40,
    wins: 25,
    losses: 13,
    draws: 2,
    points: 50,
  },
];

export default function TeamsScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Teams',
          headerShown: true,
        }}
      />

      <FlatList
        data={mockTeams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TeamCard
            team={item}
            onPress={() => {
              // Navigate to team details
              console.log('Navigate to team:', item.id);
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