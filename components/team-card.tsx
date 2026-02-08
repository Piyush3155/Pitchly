import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface TeamCardProps {
  team: {
    id: string;
    name: string;
    shortName: string;
    flag?: string; // URL or emoji
    captain: string;
    coach?: string;
    matchesPlayed: number;
    wins: number;
    losses: number;
    draws: number;
    points?: number;
  };
  onPress?: () => void;
}

export function TeamCard({ team, onPress }: TeamCardProps) {
  const winPercentage = team.matchesPlayed > 0
    ? ((team.wins / team.matchesPlayed) * 100).toFixed(1)
    : '0.0';

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <ThemedView style={styles.card}>
        <ThemedView style={styles.header}>
          <ThemedText style={styles.flag}>{team.flag || '🏏'}</ThemedText>
          <ThemedView style={styles.teamInfo}>
            <ThemedText type="subtitle" style={styles.teamName}>
              {team.name}
            </ThemedText>
            <ThemedText style={styles.shortName}>({team.shortName})</ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.captainInfo}>
          <ThemedText style={styles.label}>Captain:</ThemedText>
          <ThemedText style={styles.value}>{team.captain}</ThemedText>
        </ThemedView>

        {team.coach && (
          <ThemedView style={styles.captainInfo}>
            <ThemedText style={styles.label}>Coach:</ThemedText>
            <ThemedText style={styles.value}>{team.coach}</ThemedText>
          </ThemedView>
        )}

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Matches:</ThemedText>
            <ThemedText style={styles.statValue}>{team.matchesPlayed}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Won:</ThemedText>
            <ThemedText style={styles.statValue}>{team.wins}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Lost:</ThemedText>
            <ThemedText style={styles.statValue}>{team.losses}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Draw:</ThemedText>
            <ThemedText style={styles.statValue}>{team.draws}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.statRow}>
            <ThemedText style={styles.statLabel}>Win %:</ThemedText>
            <ThemedText style={styles.statValue}>{winPercentage}%</ThemedText>
          </ThemedView>

          {team.points !== undefined && (
            <ThemedView style={styles.statRow}>
              <ThemedText style={styles.statLabel}>Points:</ThemedText>
              <ThemedText style={styles.statValue}>{team.points}</ThemedText>
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    marginBottom: 2,
  },
  shortName: {
    fontSize: 14,
    color: '#666',
  },
  captainInfo: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    width: 60,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  statsContainer: {
    marginTop: 12,
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