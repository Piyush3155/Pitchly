import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface Batsman {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal?: string;
}

interface Bowler {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface ScorecardProps {
  battingTeam: string;
  bowlingTeam: string;
  batsmen: Batsman[];
  bowlers: Bowler[];
  totalRuns: number;
  totalWickets: number;
  totalOvers: number;
}

export function Scorecard({
  battingTeam,
  bowlingTeam,
  batsmen,
  bowlers,
  totalRuns,
  totalWickets,
  totalOvers,
}: ScorecardProps) {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {battingTeam} Batting
        </ThemedText>

        <ThemedView style={styles.tableHeader}>
          <ThemedText style={[styles.cell, styles.batsmanCell]}>Batsman</ThemedText>
          <ThemedText style={styles.cell}>R</ThemedText>
          <ThemedText style={styles.cell}>B</ThemedText>
          <ThemedText style={styles.cell}>4s</ThemedText>
          <ThemedText style={styles.cell}>6s</ThemedText>
          <ThemedText style={styles.cell}>SR</ThemedText>
        </ThemedView>

        {batsmen.map((batsman, index) => (
          <ThemedView key={index} style={styles.tableRow}>
            <ThemedText style={[styles.cell, styles.batsmanCell, batsman.isOut && styles.out]}>
              {batsman.name}
              {batsman.dismissal && ` (${batsman.dismissal})`}
            </ThemedText>
            <ThemedText style={styles.cell}>{batsman.runs}</ThemedText>
            <ThemedText style={styles.cell}>{batsman.balls}</ThemedText>
            <ThemedText style={styles.cell}>{batsman.fours}</ThemedText>
            <ThemedText style={styles.cell}>{batsman.sixes}</ThemedText>
            <ThemedText style={styles.cell}>{batsman.strikeRate}</ThemedText>
          </ThemedView>
        ))}

        <ThemedView style={styles.totalRow}>
          <ThemedText style={[styles.cell, styles.batsmanCell, styles.totalText]}>
            Total: {totalRuns}/{totalWickets} ({totalOvers} overs)
          </ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          {bowlingTeam} Bowling
        </ThemedText>

        <ThemedView style={styles.tableHeader}>
          <ThemedText style={[styles.cell, styles.bowlerCell]}>Bowler</ThemedText>
          <ThemedText style={styles.cell}>O</ThemedText>
          <ThemedText style={styles.cell}>M</ThemedText>
          <ThemedText style={styles.cell}>R</ThemedText>
          <ThemedText style={styles.cell}>W</ThemedText>
          <ThemedText style={styles.cell}>Econ</ThemedText>
        </ThemedView>

        {bowlers.map((bowler, index) => (
          <ThemedView key={index} style={styles.tableRow}>
            <ThemedText style={[styles.cell, styles.bowlerCell]}>{bowler.name}</ThemedText>
            <ThemedText style={styles.cell}>{bowler.overs}</ThemedText>
            <ThemedText style={styles.cell}>{bowler.maidens}</ThemedText>
            <ThemedText style={styles.cell}>{bowler.runs}</ThemedText>
            <ThemedText style={styles.cell}>{bowler.wickets}</ThemedText>
            <ThemedText style={styles.cell}>{bowler.economy}</ThemedText>
          </ThemedView>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  totalRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 4,
    backgroundColor: '#e9ecef',
    borderTopWidth: 2,
    borderTopColor: '#dee2e6',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  batsmanCell: {
    flex: 2,
    textAlign: 'left',
  },
  bowlerCell: {
    flex: 2,
    textAlign: 'left',
  },
  out: {
    textDecorationLine: 'line-through',
    color: '#6c757d',
  },
  totalText: {
    fontWeight: 'bold',
  },
});