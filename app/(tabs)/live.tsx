import { LinearGradient } from "expo-linear-gradient";
import { Link, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
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
    // Auto-refresh every 60 seconds (to respect API limits better)
    const interval = setInterval(loadMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemedView className="flex-1">
      {/* Header */}
      <View style={{ paddingTop: insets.top }}>
        <LinearGradient
          colors={
            isDark
              ? CricketColors.gradients.headerDark
              : CricketColors.gradients.header
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="px-5 pb-4 pt-3 rounded-b-3xl shadow-md z-10"
        >
          <View className="flex-row items-center">
            <View className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2 animate-pulse border-2 border-white/20" />
            <ThemedText className="text-xl font-bold text-white tracking-tight">
              Live Coverage
            </ThemedText>
          </View>
        </LinearGradient>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={CricketColors.primary[500]} />
          <ThemedText className="mt-4 opacity-60 font-medium">
            Tuning into live frequencies...
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          className="flex-1 -mt-2 bg-transparent"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={CricketColors.primary[500]}
            />
          }
        >
          <View>
            {matches.length === 0 ? (
              <View className="items-center py-20 mx-6">
                <ThemedText className="text-6xl mb-4 opacity-80">🏏</ThemedText>
                <ThemedText className="text-xl font-bold mb-2">
                  All Quiet on the Pitch
                </ThemedText>
                <ThemedText className="text-sm opacity-60 text-center leading-5">
                  There are no live matches at the moment.{"\n"}Check back later
                  or explore upcoming fixtures.
                </ThemedText>
              </View>
            ) : (
              groupMatchesBySeries(matches).map((group: MatchGroup) => (
                <View key={group.seriesName} className="mb-6">
                  {/* Series Header */}
                  <View className="flex-row items-center px-5 py-2 mb-2">
                    <ThemedText className="text-base mr-2">🏆</ThemedText>
                    <ThemedText
                      className="text-xs font-bold uppercase tracking-wider opacity-60 flex-1"
                      numberOfLines={1}
                    >
                      {group.seriesName}
                    </ThemedText>
                    <View className="bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/20">
                      <ThemedText className="text-[10px] font-bold text-red-500">
                        {group.matches.length} LIVE
                      </ThemedText>
                    </View>
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
