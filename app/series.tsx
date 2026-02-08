import { Stack } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

// Mock data - replace with real API data
const mockSeries = [
  {
    id: '1',
    name: 'India vs Australia Test Series 2024',
    format: 'Test',
    status: 'Ongoing',
    matches: '2/5',
    winner: null,
    venue: 'Australia',
  },
  {
    id: '2',
    name: 'World Cup 2023',
    format: 'ODI',
    status: 'Completed',
    matches: '48/48',
    winner: 'Australia',
    venue: 'India',
  },
  {
    id: '3',
    name: 'T20 World Cup 2024',
    format: 'T20',
    status: 'Upcoming',
    matches: '0/55',
    winner: null,
    venue: 'West Indies & USA',
  },
  {
    id: '4',
    name: 'Ashes Series 2023',
    format: 'Test',
    status: 'Completed',
    matches: '5/5',
    winner: 'Australia',
    venue: 'England',
  },
];

export default function SeriesScreen() {
  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Series',
          headerShown: true,
        }}
      />

      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          Cricket Series
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Tournaments and series standings
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.seriesList}>
        {mockSeries.map((series) => (
          <TouchableOpacity
            key={series.id}
            style={styles.seriesCard}
            onPress={() => {
              // Navigate to series details
              console.log('Navigate to series:', series.id);
            }}
          >
            <ThemedView style={styles.seriesHeader}>
              <ThemedText type="subtitle" style={styles.seriesName}>
                {series.name}
              </ThemedText>
              <ThemedView
                style={[
                  styles.statusBadge,
                  series.status === 'Ongoing' && styles.ongoingBadge,
                  series.status === 'Completed' && styles.completedBadge,
                  series.status === 'Upcoming' && styles.upcomingBadge,
                ]}
              >
                <ThemedText style={styles.statusText}>{series.status}</ThemedText>
              </ThemedView>
            </ThemedView>

            <ThemedView style={styles.seriesDetails}>
              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Format:</ThemedText>
                <ThemedText style={styles.detailValue}>{series.format}</ThemedText>
              </ThemedView>

              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Matches:</ThemedText>
                <ThemedText style={styles.detailValue}>{series.matches}</ThemedText>
              </ThemedView>

              <ThemedView style={styles.detailRow}>
                <ThemedText style={styles.detailLabel}>Venue:</ThemedText>
                <ThemedText style={styles.detailValue}>{series.venue}</ThemedText>
              </ThemedView>

              {series.winner && (
                <ThemedView style={styles.detailRow}>
                  <ThemedText style={styles.detailLabel}>Winner:</ThemedText>
                  <ThemedText style={[styles.detailValue, styles.winnerText]}>
                    🏆 {series.winner}
                  </ThemedText>
                </ThemedView>
              )}
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  seriesList: {
    padding: 20,
  },
  seriesCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  seriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  seriesName: {
    flex: 1,
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ongoingBadge: {
    backgroundColor: '#28a745',
  },
  completedBadge: {
    backgroundColor: '#6c757d',
  },
  upcomingBadge: {
    backgroundColor: '#007bff',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  seriesDetails: {
    // Container for series details
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  winnerText: {
    color: '#28a745',
  },
});