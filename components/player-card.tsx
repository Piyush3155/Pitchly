import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface PlayerCardProps {
  player: {
    id: string;
    name: string;
    role: string; // batsman, bowler, all-rounder, wicket-keeper
    team: string;
    stats: {
      matches: number;
      runs?: number;
      wickets?: number;
      average?: number;
      strikeRate?: number;
      economy?: number;
    };
  };
  onPress?: () => void;
}

export function PlayerCard({ player, onPress }: PlayerCardProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.header}>
          <ThemedText type="subtitle" style={styles.playerName}>
            {player.name}
          </ThemedText>
          <ThemedText style={styles.role}>{player.role}</ThemedText>
        </ThemedView>

        <ThemedText style={styles.team}>{player.team}</ThemedText>

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Matches:</ThemedText>
            <ThemedText style={styles.statValue}>{player.stats.matches}</ThemedText>
          </ThemedView>

          {player.stats.runs !== undefined && (
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Runs:</ThemedText>
              <ThemedText style={styles.statValue}>{player.stats.runs}</ThemedText>
            </ThemedView>
          )}

          {player.stats.wickets !== undefined && (
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Wickets:</ThemedText>
              <ThemedText style={styles.statValue}>{player.stats.wickets}</ThemedText>
            </ThemedView>
          )}

          {player.stats.average !== undefined && (
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Average:</ThemedText>
              <ThemedText style={styles.statValue}>{player.stats.average}</ThemedText>
            </ThemedView>
          )}

          {player.stats.strikeRate !== undefined && (
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Strike Rate:</ThemedText>
              <ThemedText style={styles.statValue}>{player.stats.strikeRate}</ThemedText>
            </ThemedView>
          )}

          {player.stats.economy !== undefined && (
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Economy:</ThemedText>
              <ThemedText style={styles.statValue}>{player.stats.economy}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
  card: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 8,
  },
  playerName: {
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  team: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  statsContainer: {
    // Container for stats
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