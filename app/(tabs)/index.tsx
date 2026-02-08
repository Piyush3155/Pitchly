import { Link } from 'expo-router';
import { ScrollView, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1">
      <ThemedView className="px-5 pt-20 pb-5 items-center">
        <ThemedText className="text-4xl text-center mb-2">
          🏏 Cricket Score
        </ThemedText>
        <ThemedText className="text-base text-center opacity-70">
          Live scores, match updates, and statistics
        </ThemedText>
      </ThemedView>

      <ThemedView className="px-5">
        <Link href="/matches" asChild>
          <View className="flex-row items-center p-4 mb-3 rounded-xl shadow-md shadow-black/10 elevation-3">
            <ThemedView className="w-12 h-12 rounded-2xl bg-blue-50 items-center justify-center mr-4">
              <IconSymbol name="list.bullet" size={24} color="#007AFF" />
            </ThemedView>
            <ThemedView className="flex-1">
              <ThemedText className="text-lg font-semibold mb-1">
                Matches
              </ThemedText>
              <ThemedText className="text-sm opacity-70">
                View all cricket matches and fixtures
              </ThemedText>
            </ThemedView>
          </View>
        </Link>

        <Link href="/live" asChild>
          <View className="flex-row items-center p-4 mb-3 rounded-xl shadow-md shadow-black/10 elevation-3">
            <ThemedView className="w-12 h-12 rounded-2xl bg-red-50 items-center justify-center mr-4">
              <IconSymbol name="play.circle.fill" size={24} color="#FF3B30" />
            </ThemedView>
            <ThemedView className="flex-1">
              <ThemedText className="text-lg font-semibold mb-1">
                Live Scores
              </ThemedText>
              <ThemedText className="text-sm opacity-70">
                Follow live match updates and commentary
              </ThemedText>
            </ThemedView>
          </View>
        </Link>

        <Link href="/teams" asChild>
          <View className="flex-row items-center p-4 mb-3 rounded-xl shadow-md shadow-black/10 elevation-3">
            <ThemedView className="w-12 h-12 rounded-2xl bg-green-50 items-center justify-center mr-4">
              <IconSymbol name="person.3.fill" size={24} color="#34C759" />
            </ThemedView>
            <ThemedView className="flex-1">
              <ThemedText className="text-lg font-semibold mb-1">
                Teams
              </ThemedText>
              <ThemedText className="text-sm opacity-70">
                Explore cricket teams and their statistics
              </ThemedText>
            </ThemedView>
          </View>
        </Link>

        <Link href="/players" asChild>
          <View className="flex-row items-center p-4 mb-3 rounded-xl shadow-md shadow-black/10 elevation-3">
            <ThemedView className="w-12 h-12 rounded-2xl bg-orange-50 items-center justify-center mr-4">
              <IconSymbol name="person.fill" size={24} color="#FF9500" />
            </ThemedView>
            <ThemedView className="flex-1">
              <ThemedText className="text-lg font-semibold mb-1">
                Players
              </ThemedText>
              <ThemedText className="text-sm opacity-70">
                Player profiles and performance stats
              </ThemedText>
            </ThemedView>
          </View>
        </Link>

        <Link href="/series" asChild>
          <View className="flex-row items-center p-4 mb-3 rounded-xl shadow-md shadow-black/10 elevation-3">
            <ThemedView className="w-12 h-12 rounded-2xl bg-purple-50 items-center justify-center mr-4">
              <IconSymbol name="trophy.fill" size={24} color="#AF52DE" />
            </ThemedView>
            <ThemedView className="flex-1">
              <ThemedText className="text-lg font-semibold mb-1">
                Series
              </ThemedText>
              <ThemedText className="text-sm opacity-70">
                Tournament standings and results
              </ThemedText>
            </ThemedView>
          </View>
        </Link>
      </ThemedView>

      <ThemedView className="px-5 pt-0">
        <ThemedText className="text-lg font-semibold mb-4">
          Featured Matches
        </ThemedText>
        <ThemedText className="text-sm text-center opacity-60 italic">
          Match cards and live updates coming soon...
        </ThemedText>
      </ThemedView>
    </ScrollView>
  );
}
