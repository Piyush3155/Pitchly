import { Stack } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { Commentary, LiveScore, OverSummary, WicketCard } from '@/components';

// Mock data - replace with real API data
const mockLiveScore = {
  team1: 'India',
  team2: 'Australia',
  score1: '245/3',
  score2: '180/6',
  overs1: '45.2',
  overs2: '32.1',
  currentInnings: 2 as const,
  status: 'Live - Australia need 66 runs to win',
  target: 246,
};

const mockOverSummary = {
  bowler: 'Jasprit Bumrah',
  overNumber: 32,
  balls: [
    { runs: 1, isWicket: false },
    { runs: 0, isWicket: false },
    { runs: 4, isWicket: false },
    { runs: 1, isWicket: false },
    { runs: 0, isWicket: false },
    { runs: 6, isWicket: false },
  ],
  totalRuns: 12,
  wickets: 0,
};

const mockCommentary = [
  {
    id: '1',
    over: 32,
    ball: 1,
    batsman: 'Steve Smith',
    bowler: 'Jasprit Bumrah',
    description: 'Full delivery on off stump, driven through covers for a boundary!',
    runs: 4,
    isWicket: false,
    timestamp: '2:45 PM',
  },
  {
    id: '2',
    over: 31,
    ball: 6,
    batsman: 'David Warner',
    bowler: 'Mohammed Shami',
    description: 'OUT! Caught behind! Shami gets the breakthrough.',
    runs: 0,
    isWicket: true,
    timestamp: '2:40 PM',
  },
];

const mockWicket = {
  id: '1',
  batsman: 'David Warner',
  bowler: 'Mohammed Shami',
  fielder: 'MS Dhoni',
  dismissalType: 'caught',
  over: 31,
  ball: 6,
  score: 45,
  ballsFaced: 32,
};

export default function LiveScreen() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Live Scores',
          headerShown: true,
        }}
      />

      <LiveScore {...mockLiveScore} />

      <OverSummary {...mockOverSummary} />

      <Commentary commentary={mockCommentary} />

      <WicketCard wicket={mockWicket} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});