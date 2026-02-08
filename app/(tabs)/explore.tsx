import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

// Mock news data - replace with real API data
const mockNews = [
  {
    id: '1',
    title: 'India vs Australia: Rohit Sharma leads from the front in Melbourne',
    summary: 'Rohit Sharma scored a brilliant century as India took control of the first Test against Australia.',
    category: 'Match Report',
    timeAgo: '2 hours ago',
  },
  {
    id: '2',
    title: 'World Cup 2023: Australia crowned champions after thrilling final',
    summary: 'Australia defeated India by 6 wickets in a nail-biting World Cup final at Ahmedabad.',
    category: 'Tournament',
    timeAgo: '1 day ago',
  },
  {
    id: '3',
    title: 'IPL 2024 Auction: Stars and surprises from the mega event',
    summary: 'Mitchell Starc and Pat Cummins were among the big names who found new homes.',
    category: 'IPL',
    timeAgo: '3 days ago',
  },
  {
    id: '4',
    title: 'Young talent: Shabaaz Ahmed shines in domestic cricket',
    summary: 'The 19-year-old pace bowler picked up 5 wickets in the Ranji Trophy match.',
    category: 'Domestic',
    timeAgo: '5 days ago',
  },
];

export default function NewsScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={styles.title}>
          📰 Cricket News
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          Latest updates and stories
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.newsList}>
        {mockNews.map((news) => (
          <TouchableOpacity
            key={news.id}
            style={styles.newsCard}
            onPress={() => {
              // Navigate to news article
              console.log('Navigate to news:', news.id);
            }}
          >
            <ThemedView style={styles.newsHeader}>
              <ThemedView style={styles.categoryBadge}>
                <ThemedText style={styles.categoryText}>{news.category}</ThemedText>
              </ThemedView>
              <ThemedText style={styles.timeAgo}>{news.timeAgo}</ThemedText>
            </ThemedView>

            <ThemedText type="subtitle" style={styles.newsTitle}>
              {news.title}
            </ThemedText>

            <ThemedText style={styles.newsSummary}>
              {news.summary}
            </ThemedText>

            <ThemedView style={styles.newsFooter}>
              <ThemedText style={styles.readMore}>Read more</ThemedText>
              <IconSymbol name="chevron.right" size={16} color="#007AFF" />
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
  newsList: {
    padding: 20,
  },
  newsCard: {
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  timeAgo: {
    fontSize: 12,
    color: '#666',
  },
  newsTitle: {
    marginBottom: 8,
    lineHeight: 24,
  },
  newsSummary: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  readMore: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
