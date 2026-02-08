import { Stack } from 'expo-router';
import { FlatList, StyleSheet } from 'react-native';

import { MatchCard } from '@/components';
import { ThemedView } from '@/components/themed-view';

// Mock data - replace with real API data
const mockMatches = [
  {
    id: '1',
    team1: 'India',
    team2: 'Australia',
    status: 'Live',
    score1: '245/3 (45.2)',
    score2: '180/6 (32.1)',
    venue: 'Melbourne Cricket Ground',
    date: 'Today, 2:30 PM',
  },
  {
    id: '2',
    team1: 'England',
    team2: 'South Africa',
    status: 'Scheduled',
    venue: 'Lord\'s Cricket Ground',
    date: 'Tomorrow, 11:00 AM',
  },
  {
    id: '3',
    team1: 'Pakistan',
    team2: 'New Zealand',
    status: 'Completed',
    score1: '320/7 (50)',
    score2: '315/9 (50)',
    venue: 'Eden Park',
    date: 'Yesterday',
  },
];

export default function MatchesScreen() {
  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Matches',
          headerShown: true,
        }}
      />

      <FlatList
        data={mockMatches}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MatchCard
            match={item}
            onPress={() => {
              // Navigate to match details
              console.log('Navigate to match:', item.id);
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