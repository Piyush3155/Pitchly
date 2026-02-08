import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface WicketCardProps {
  wicket: {
    id: string;
    batsman: string;
    bowler: string;
    fielder?: string;
    dismissalType: string; // bowled, caught, run out, LBW, etc.
    over: number;
    ball: number;
    score: number;
    ballsFaced: number;
  };
}

export function WicketCard({ wicket }: WicketCardProps) {
  const getDismissalDescription = () => {
    switch (wicket.dismissalType.toLowerCase()) {
      case 'bowled':
        return `${wicket.batsman} b ${wicket.bowler}`;
      case 'caught':
        return `${wicket.batsman} c ${wicket.fielder || 'fielder'} b ${wicket.bowler}`;
      case 'run out':
        return `${wicket.batsman} run out`;
      case 'lbw':
        return `${wicket.batsman} lbw b ${wicket.bowler}`;
      case 'caught and bowled':
        return `${wicket.batsman} c&b ${wicket.bowler}`;
      default:
        return `${wicket.batsman} ${wicket.dismissalType} b ${wicket.bowler}`;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText style={styles.wicketIcon}>❌</ThemedText>
        <ThemedText type="subtitle" style={styles.title}>
          WICKET!
        </ThemedText>
        <ThemedText style={styles.overBall}>
          {wicket.over}.{wicket.ball}
        </ThemedText>
      </ThemedView>

      <ThemedText style={styles.dismissal}>{getDismissalDescription()}</ThemedText>

      <ThemedView style={styles.stats}>
        <ThemedView style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Runs:</ThemedText>
          <ThemedText style={styles.statValue}>{wicket.score}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Balls:</ThemedText>
          <ThemedText style={styles.statValue}>{wicket.ballsFaced}</ThemedText>
        </ThemedView>

        <ThemedView style={styles.statRow}>
          <ThemedText style={styles.statLabel}>Strike Rate:</ThemedText>
          <ThemedText style={styles.statValue}>
            {wicket.ballsFaced > 0 ? ((wicket.score / wicket.ballsFaced) * 100).toFixed(2) : '0.00'}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    backgroundColor: '#f8d7da',
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  wicketIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  title: {
    color: '#721c24',
    flex: 1,
  },
  overBall: {
    fontSize: 14,
    color: '#721c24',
    fontWeight: 'bold',
  },
  dismissal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#721c24',
    marginBottom: 12,
    lineHeight: 22,
  },
  stats: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 6,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});