import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { MatchCard } from "@/components/match-card";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { CricketColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
  fetchCurrentMatches,
  groupMatchesBySeries,
  initializeCountries,
  isMatchLive,
  Match,
  MatchGroup,
} from "@/services/cricapi";

export default function LiveScreen() {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadMatches = async () => {
    try {
      await initializeCountries();
      const data = await fetchCurrentMatches();
      const liveMatches = data.filter((m) => isMatchLive(m.status));
      setMatches(liveMatches);
    } catch (error) {
      console.error("Error loading matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMatches();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    loadMatches();
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedView className="flex-1">
      {/* Premium Header */}
      <View style={{ paddingTop: insets.top }}>
        <LinearGradient
          colors={
            isDark
              ? CricketColors.gradients.headerDark
              : CricketColors.gradients.header
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pb-6 pt-4 rounded-b-3xl shadow-lg z-10"
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse border-2 border-white/20" />
              <ThemedText className="text-2xl font-bold text-white tracking-tight">
                Live Coverage
              </ThemedText>
            </View>
            <View className="bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
              <ThemedText className="text-white text-xs font-bold">
                {matches.length} ON AIR
              </ThemedText>
            </View>
          </View>
        </LinearGradient>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={CricketColors.primary[500]} />
          <ThemedText className="mt-4 opacity-60 font-medium">
            Connecting to live feed...
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          className="flex-1 -mt-4 bg-transparent"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={CricketColors.primary[500]}
              colors={[CricketColors.primary[500]]} // Android
            />
          }
        >
          <View>
            {matches.length === 0 ? (
              <View className="items-center justify-center py-20 mx-8">
                <View className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full items-center justify-center mb-6">
                  <ThemedText className="text-4xl opacity-50">📡</ThemedText>
                </View>
                <ThemedText className="text-xl font-bold mb-2 text-center">
                  No Live Matches
                </ThemedText>
                <ThemedText className="text-sm opacity-50 text-center leading-6">
                  There is no live cricket action at the moment.{"\n"}Check the
                  schedule for upcoming games.
                </ThemedText>

                <Link href="/matches" asChild>
                  <TouchableOpacity className="mt-8 bg-green-600 px-6 py-3 rounded-full shadow-md shadow-green-600/20">
                    <ThemedText className="text-white font-bold text-sm">
                      View Upcoming Fixtures
                    </ThemedText>
                  </TouchableOpacity>
                </Link>
              </View>
            ) : (
              groupMatchesBySeries(matches).map((group: MatchGroup) => (
                <View key={group.seriesName} className="mb-6">
                  {/* Series Header */}
                  <View className="flex-row items-center px-6 py-2 mb-3">
                    <ThemedText className="text-xs font-bold uppercase tracking-widest opacity-50 flex-1">
                      {group.seriesName}
                    </ThemedText>
                  </View>

                  {/* Matches in this series */}
                  {group.matches.map((match) => (
                    <Link key={match.id} href={`/match/${match.id}`} asChild>
                      <MatchCard data={match as any} showSeries={false} />
                    </Link>
                  ))}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </ThemedView>
  );
}
