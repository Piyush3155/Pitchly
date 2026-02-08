import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface CommentaryItem {
  id: string;
  over: number;
  ball: number;
  batsman: string;
  bowler: string;
  description: string;
  runs: number;
  isWicket: boolean;
  timestamp: string;
}

interface CommentaryProps {
  commentary: CommentaryItem[];
}

export function Commentary({ commentary }: CommentaryProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.title}>
        Commentary
      </ThemedText>

      <ScrollView style={styles.scrollContainer}>
        {commentary.map((item) => (
          <ThemedView key={item.id} style={styles.commentaryItem}>
            <ThemedView style={styles.header}>
              <ThemedText style={styles.overBall}>
                {item.over}.{item.ball}
              </ThemedText>
              <ThemedText style={styles.timestamp}>{item.timestamp}</ThemedText>
            </ThemedView>

            <ThemedView style={styles.players}>
              <ThemedText style={styles.batsman}>{item.batsman}</ThemedText>
              <ThemedText style={styles.vs}>vs</ThemedText>
              <ThemedText style={styles.bowler}>{item.bowler}</ThemedText>
            </ThemedView>

            <ThemedText
              style={[
                styles.description,
                item.isWicket && styles.wicketText,
                item.runs > 0 && styles.runsText,
              ]}
            >
              {item.description}
            </ThemedText>

            <ThemedView style={styles.footer}>
              {item.runs > 0 && (
                <ThemedText style={styles.runs}>{item.runs} run{item.runs !== 1 ? 's' : ''}</ThemedText>
              )}
              {item.isWicket && (
                <ThemedText style={styles.wicket}>WICKET!</ThemedText>
              )}
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  commentaryItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  overBall: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007bff',
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
  },
  players: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  batsman: {
    fontSize: 14,
    fontWeight: '600',
  },
  vs: {
    fontSize: 12,
    color: '#6c757d',
    marginHorizontal: 8,
  },
  bowler: {
    fontSize: 14,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  wicketText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  runsText: {
    color: '#28a745',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  runs: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: 'bold',
  },
  wicket: {
    fontSize: 12,
    color: '#dc3545',
    fontWeight: 'bold',
  },
});