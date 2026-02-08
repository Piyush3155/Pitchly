import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface Ball {
  runs: number;
  isWicket: boolean;
  isNoBall?: boolean;
  isWide?: boolean;
  isBye?: boolean;
  isLegBye?: boolean;
}

interface OverSummaryProps {
  bowler: string;
  overNumber: number;
  balls: Ball[];
  totalRuns: number;
  wickets: number;
}

export function OverSummary({ bowler, overNumber, balls, totalRuns, wickets }: OverSummaryProps) {
  const getBallDisplay = (ball: Ball) => {
    if (ball.isWicket) return 'W';
    if (ball.isNoBall) return `NB${ball.runs}`;
    if (ball.isWide) return `WD${ball.runs}`;
    if (ball.isBye) return `B${ball.runs}`;
    if (ball.isLegBye) return `LB${ball.runs}`;
    return ball.runs.toString();
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="subtitle" style={styles.title}>
          Over {overNumber}
        </ThemedText>
        <ThemedText style={styles.bowler}>Bowled by {bowler}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.ballsContainer}>
        {balls.map((ball, index) => (
          <ThemedView
            key={index}
            style={[
              styles.ball,
              ball.isWicket && styles.wicketBall,
              ball.runs === 4 && styles.fourBall,
              ball.runs === 6 && styles.sixBall,
            ]}
          >
            <ThemedText style={styles.ballText}>{getBallDisplay(ball)}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.summary}>
        <ThemedText style={styles.summaryText}>
          This Over: {totalRuns} runs, {wickets} wicket{wickets !== 1 ? 's' : ''}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    marginBottom: 4,
  },
  bowler: {
    fontSize: 14,
    color: '#666',
  },
  ballsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  ball: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  wicketBall: {
    backgroundColor: '#dc3545',
  },
  fourBall: {
    backgroundColor: '#ffc107',
  },
  sixBall: {
    backgroundColor: '#28a745',
  },
  ballText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  summary: {
    alignItems: 'center',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});